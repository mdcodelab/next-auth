import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/app/lib/db";
import * as bcrypt from "bcrypt";
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: { label: "User name:", type: "text", placeholder: "Your username" },
        password: { label: "Password:", type: "password", placeholder: "Your password" },
      },
      authorize : async (credentials) => {
        let user = db.user.findUnique({
          where: {
            email: credentials.username
          },
        });
        if (!user) {
          return null;
        }

        if(!credentials.password){throw new Error ("Please provide your password.")}
        const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);

        if(!isCorrectPassword) {throw new Error ("Your password is incorrect")}

        //if auth is successful, return user without password (not safe to return the password)
        const {password, ...userWithoutPassword}=user;

        return userWithoutPassword;
      }
    })
  ],
});

 const 