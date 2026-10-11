import { MongoMemoryServer } from "mongodb-memory-server";
import { existsSync } from "node:fs";

/**
 * Starts a throwaway MongoDB for the portal tests. Uses TEST_MONGODB_URI when set; otherwise an in-memory
 * server (a local mongod binary when one is installed, so no download is needed).
 */
const LOCAL_MONGOD = ["/opt/homebrew/bin/mongod", "/usr/local/bin/mongod", "/usr/bin/mongod"].find((p) => existsSync(p));

let server: MongoMemoryServer | null = null;

export async function startDb(): Promise<void> {
  if (process.env.TEST_MONGODB_URI) {
    process.env.MONGODB_URI = process.env.TEST_MONGODB_URI;
    return;
  }
  if (LOCAL_MONGOD && !process.env.MONGOMS_SYSTEM_BINARY) process.env.MONGOMS_SYSTEM_BINARY = LOCAL_MONGOD;
  server = await MongoMemoryServer.create();
  process.env.MONGODB_URI = server.getUri("dronahost_portal_test");
}

export async function stopDb(): Promise<void> {
  const { default: mongoose } = await import("mongoose");
  if (process.env.TEST_MONGODB_URI && mongoose.connection.db) await mongoose.connection.db.dropDatabase();
  await mongoose.disconnect();
  await server?.stop();
}
