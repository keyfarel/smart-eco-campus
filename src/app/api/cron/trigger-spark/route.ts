import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

export async function POST(req: Request) {
  try {
    const command = 'ssh -p 2222 hadoopuser@127.0.0.1 "/usr/local/spark/bin/spark-submit --master local[*] ~/spark_etl_job.py"';
    console.log("[SparkTrigger] Executing command:", command);
    
    // Set timeout to 60 seconds just in case Spark takes too long
    const { stdout, stderr } = await execAsync(command, { timeout: 60000 });
    
    console.log("[SparkTrigger] Output:", stdout);
    if (stderr) console.error("[SparkTrigger] Stderr:", stderr);

    return NextResponse.json({ success: true, message: "PySpark ETL job completed successfully" });
  } catch (error: any) {
    console.error("[SparkTrigger] Error:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Failed to execute Spark job" },
      { status: 500 }
    );
  }
}
