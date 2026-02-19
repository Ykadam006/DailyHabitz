const path = require("path");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

beforeAll(async () => {
  process.env.NODE_ENV = "test";

  if (process.env.MONGO_URI) {
    await mongoose.connect(process.env.MONGO_URI);
    return;
  }

  process.env.MONGOMS_DOWNLOAD_DIR = path.join(__dirname, "..", ".tmp", "mongodb-binaries");
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  process.env.MONGO_URI = uri;
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) await mongoServer.stop();
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
});
