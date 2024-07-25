import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import * as z from "zod";
import { compare } from "bcryptjs";
import { getUserByEmail } from "./utils/getUser";

const LoginSchema = z.object({
  email: z.string().email({ message: "Email is required." }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export const {
  handlers: { GET, POST },
  signIn,
  signOut,
  auth,
} = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      async authorize(credentials) {
        const email = credentials.email;
        const password = credentials.password;
        console.log(email, password);
        console.log("credentials", credentials);
        const validateFields = LoginSchema.safeParse(credentials);
        if (validateFields.success) {
          const { email, password } = validateFields.data;

          const existingUser = await getUserByEmail(email);
          console.log(existingUser);
          if (!existingUser || !existingUser.password) return null; // no password, logged with google

          const passwordMatch = await compare(password, existingUser.password);
          if (passwordMatch) return existingUser;
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async redirect({ url, baseUrl }) {
      console.log("Redirect URL:", url);
      console.log("Base URL:", baseUrl);

      if (typeof url !== "string") {
        console.error("URL is not a string:", url);
        return baseUrl;
      }

      // Redirect to profile after login
      if (url.startsWith("/")) {
        return `${baseUrl}/profile`;
      }
      return new URL("/profile", baseUrl).toString();
    },
  },

  pages: {
    signIn: "/profile", // Setează pagina de login
  },
});
