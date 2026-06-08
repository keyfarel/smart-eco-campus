import "next-auth";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: "SUPER_ADMIN" | "ADMIN_GEDUNG";
    assignedGedung?: string;
  }

  interface Session {
    user: {
      id?: string;
      role?: "SUPER_ADMIN" | "ADMIN_GEDUNG";
      assignedGedung?: string;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "SUPER_ADMIN" | "ADMIN_GEDUNG";
    assignedGedung?: string;
  }
}
