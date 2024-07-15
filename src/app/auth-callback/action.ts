// action.ts module contains server-side logic RPC functions
// design > action.ts: has explanation about the purpose of action.ts file
"use server";

import { db } from "@/db";
// in Server Components you can get the Kinde Auth data by using the getKindeServerSession helper
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

// checks if user is logged in and adds user to the DB if it doesn't exist there
export async function getAuthStatus() {
  // the getUser() function reads the cookies attached to that API request and returns the currently logged-in user
  const { getUser } = getKindeServerSession();
  // the 'user' object contains the currently logged-in user from the current session
  const user = await getUser();

  // throw error if user data has not been found
  if (!user?.id || !user.email) {
    throw new Error("Invalid user data");
  }

  // check if user already exists in the DB
  const existingUser = await db.user.findFirst({
    where: { id: user.id },
  });

  // create new user object in the DB if user doesn't exist in the DB yet
  if (!existingUser) {
    await db.user.create({
      data: {
        id: user.id,
        email: user.email,
      },
    });
  }

  // return new object with a property that contains "true"
  // this indicates that the user is logged in and has been added to the DB (or not)
  return { success: true };
}
