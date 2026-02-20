import { NextAuthOptions } from "next-auth";
import KakaoProvider from "next-auth/providers/kakao";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    KakaoProvider({
      clientId: process.env.KAKAO_REST || "",
      clientSecret: process.env.KAKAO_CLIENT_SECRET || "", // 카카오 디벨로퍼스에서 보안 탭 'Client Secret' 활성화 후 입력 필요
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role as string;
        session.user.parts = (token.parts as string[]) || [];
        session.user.phone = token.phone as string | null;
      }
      return session;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.sub = user.id;
        token.role = user.role;
        token.parts = user.parts;
        token.phone = user.phone;
      }

      // Allow updating session manually from client
      if (trigger === "update" && session) {
        token.name = session.name || token.name;
        token.parts = session.parts || token.parts;
        token.phone = session.phone || token.phone;
      }
      return token;
    },
  },
};
