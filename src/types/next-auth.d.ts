import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface User {
    role?: "SUPER_ADMIN" | "ADMIN_GEDUNG" | "EXECUTIVE";
    assignedGedung?: string;
  }

  interface Session {
    user?: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "SUPER_ADMIN" | "ADMIN_GEDUNG" | "EXECUTIVE";
      assignedGedung?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: "SUPER_ADMIN" | "ADMIN_GEDUNG" | "EXECUTIVE";
    assignedGedung?: string;
  }
}
