import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUsersAsync } from "../data/users-db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Ambil daftar pengguna dinamis secara hybrid dari Firebase/JSON (Kepatuhan RBAC)
        const users = await getUsersAsync();
        
        // Cari pengguna dengan email dan kata sandi yang cocok
        const foundUser = users.find(
          (u) =>
            u.email.toLowerCase() === credentials.email.toLowerCase() &&
            u.password === credentials.password
        );

        if (foundUser) {
          // Petakan format role database (lowercase) ke role sesi Next-Auth (UPPERCASE)
          let mappedRole: "SUPER_ADMIN" | "ADMIN_GEDUNG" = "ADMIN_GEDUNG";
          if (foundUser.role === "super_admin") {
            mappedRole = "SUPER_ADMIN";
          }

          return {
            id: foundUser.uid,
            name: foundUser.name,
            email: foundUser.email,
            role: mappedRole,
            assignedGedung: foundUser.assigned_gedung,
          };
        }

        // Jika gagal login:
        return null;
      }
    })
  ],
  pages: {
    signIn: '/login', // Sesuai sitemap resmi (src/app/(auth)/login/page.tsx)
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.assignedGedung = (user as any).assignedGedung;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).assignedGedung = token.assignedGedung;
      }
      return session;
    }
  }
};
