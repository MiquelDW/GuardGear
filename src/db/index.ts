// in order to call your database to read or write data in your database, you need to instantiate a database client to access the database
// instantiate the database client to be able to read and write data in your database

import { PrismaClient } from "@prisma/client";

declare global {
  // declare global variable 'cachedPrisma' to cache the Prisma client instance across multiple invocations to avoid creating multiple instances, which can improve perforamnce and prevent issues in serverless environments
  var cachedPrisma: PrismaClient;
}

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
  // instantiate DB client to access and to read and write data in your DB (happens only once in production environment)
  prisma = new PrismaClient();
} else {
  if (!global.cachedPrisma) {
    // instantiate DB client to the 'cachedPrisma' variable if it's null (this instantiating happens only once)
    global.cachedPrisma = new PrismaClient();
  }

  // instantiate 'prisma' with the cached DB client
  prisma = global.cachedPrisma;
}

// export variable 'db' which holds the DB client to access and to read and write data in your DB
export const db = prisma;
