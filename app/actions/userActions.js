"use server";

import connectDB from "@/utils/database";
import User from "@/models/userModel";
import { hash } from "bcryptjs";
import { redirect } from "next/navigation";



export const registerUser = async (formData) => {
  const firstName=formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const password=formData.get("password");

  await connectDB();
  const existingUser = await User.findOne({email});
  if(existingUser) {
    return null;
  }

const hashedPassword = await hash(password, 12);

  const user=await User. create({
    firstName, lastName, email, password: hashedPassword
  })

const plainUser = JSON.parse(JSON.stringify(user));
console.log(plainUser);
redirect("/auth/login");
 console.log("This should not be logged");
};
