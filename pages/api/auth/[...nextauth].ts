import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";

const isProduction = process.env.VERCEL_ENV === "production";

export default NextAuth({
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: {
        params: {
          redirect_uri: isProduction
            ? "https://algolia-rule-copier.vercel.app/api/auth/callback/github"
            : "http://localhost:3000/api/auth/callback/github",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
});
