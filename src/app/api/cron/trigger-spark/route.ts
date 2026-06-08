import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    // Menggunakan Environment Variable agar dinamis saat di-deploy ke VPS
    const sshHost = process.env.SPARK_SSH_HOST || "127.0.0.1";
    const sshPort = process.env.SPARK_SSH_PORT || "2222";
    const sshUser = process.env.SPARK_SSH_USER || "hadoopuser";

    // Perintah eksekusi Spark (Dilengkapi StrictHostKeyChecking=no agar VPS tidak stuck minta konfirmasi Yes/No)
    // Ditambahkan ConnectTimeout=5 agar langsung mendeteksi jika NameNode mati
    const command = `ssh -p ${sshPort} -o ConnectTimeout=5 -o StrictHostKeyChecking=no ${sshUser}@${sshHost} "/usr/local/spark/bin/spark-submit --master local[*] ~/spark_etl_job.py"`;

    console.log("[SparkTrigger] Executing command:", command);

    // Set timeout to 3 minutes (180000 ms) because Spark on a local VM can take up to 90 seconds
    const { stdout, stderr } = await execAsync(command, { timeout: 180000 });

    console.log("[SparkTrigger] Output:", stdout);
    if (stderr) console.error("[SparkTrigger] Stderr:", stderr);

    return NextResponse.json({ success: true, message: "PySpark ETL job completed successfully" });
  } catch (error: any) {
    console.error("[SparkTrigger] Error:", error);

    let cleanMessage = "Terjadi kesalahan internal saat mengeksekusi Spark.";
    if (error.message.includes("Connection refused") || error.message.includes("Connection timed out") || error.message.includes("Connection to UNKNOWN port")) {
      cleanMessage = "Koneksi ke NameNode terputus (Mesin Offline atau Jaringan Tailscale bermasalah).";
    }

    return NextResponse.json(
      { success: false, error: cleanMessage, raw_error: error.message, stderr: error.stderr || "" },
      { status: 500 }
    );
  }
}
