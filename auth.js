import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import connectDB from "./utils/database";
import User from "./models/userModel";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        await connectDB();
        const existingUser = await User.findOne({ email }).select(
          "+password +role"
        );
        if (!existingUser || !existingUser.password) {
          return null; // no password, logged with google
        }

        console.log(existingUser);

        const passwordMatch = await compare(password, existingUser.password);
        if (passwordMatch) {
          const userData = {
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            email: existingUser.email,
            role: existingUser.role,
            id: existingUser._id,
            result: existingUser.result,
            answers: [],
          };
          return userData;
        } else {
          return null;
        }
      },
    }),
  ],

  pages: {
    signIn: "/auth/login",
  },
  
});
