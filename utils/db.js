require("dotenv").config();
const { MongoClient, MongoError, ObjectId } = require("mongodb");

const CONN_URI = process.env.DEV
  ? process.env.MONGO_DEV_URI
  : process.env.MONGO_PROD_URI;
const DB_NAME = process.env.DEV
  ? process.env.DEV_DB_NAME
  : process.env.PROD_DB_NAME;

let client = new MongoClient(CONN_URI);

async function connect() {
  try {
    let handler = await client.connect(CONN_URI);
    console.log("Connected to DB");
    return handler;
  } catch (error) {
    console.log("ERROR Connecting to DB");
    console.log(error);
    return;
  }
}

async function closeConnection() {
  await client.close();
  console.log("Disconneced from DB");
}

const logger = process.env.DEV ? console.log : require("../utils/logger");

module.exports = {
  backup: (db, source, destination) => {},
  getWorkers: async (db) => {
    logger("--- Getting current DB data ---");
    const connection = await connect();
    if (!connection) return;

    try {
      const database = client.db("dpd-dev");
      const collection = database.collection("workers");
      const query = {};
      const options = {
        sort: { nick: 1 },
      };
      const cursor = collection.find(query, options);

      // print a message if no documents were found
      if ((await cursor.count()) === 0) {
        logger("No documents found!");
        return [];
      }

      return cursor.map((el) => el);
    } catch (e) {
      logger("ERROR Getting data from DB");
      console.log(e);

      return null;
    } finally {
      // await closeConnection();
    }
  },
  async getTabor() {
    logger(`--- Getting all vehicles ---`);
    const connection = await connect();
    if (!connection) return;
    try {
      const database = client.db("dpd-dev");
      const collection = database.collection("tabor");
      const query = {};
      const options = {};
      const cursor = collection.find(query, options);

      // print a message if no documents were found
      if ((await cursor.count()) === 0) {
        logger("No documents found!");
        return [];
      }

      return cursor.map((el) => el);
    } catch (e) {
      logger("ERROR Getting data from DB");
      console.log(e);

      return null;
    } finally {
      // await closeConnection();
    }
  },

  async getWorkerVeh(workerID) {
    // = "63f7cb6d52edb09fcf28e681"
    logger(`--- Getting vehicle for worker ${workerID} ---`);
    const connection = await connect();
    if (!connection) return;

    try {
      const database = client.db("dpd-dev");
      const collection = database.collection("tabor");
      const query = workerID
        ? {
            assignedWorker: new ObjectId(workerID),
          }
        : {};
      const options = {};
      const cursor = collection.find(query, options);

      // print a message if no documents were found
      if ((await cursor.count()) === 0) {
        logger("No documents found!");
        return [];
      }

      return cursor.map((el) => el);
    } catch (e) {
      logger("ERROR Getting data from DB");
      console.log(e);

      return null;
    } finally {
      // await closeConnection();
    }
  },
  insert: async (data) => {
    console.log("---  Inserting new DB data  ---");
    const connection = await connect();
    if (!connection) return;

    try {
      const database = client.db(DB_NAME);
      const collection = database.collection("towary");
      const options = { ordered: true };
      const result = await collection.insertMany(data, options);

      console.log("Transaction successfully committed.");

      return result;
    } catch (error) {
      console.log("ERROR Inserting data to DB");
      console.log(error);
      if (
        error instanceof MongoError &&
        error.hasErrorLabel("UnknownTransactionCommitResult")
      ) {
        // add your logic to retry or handle the error
      } else if (
        error instanceof MongoError &&
        error.hasErrorLabel("TransientTransactionError")
      ) {
        // add your logic to retry or handle the error
      } else {
        console.log(
          "An error occured in the transaction, performing a data rollback:" +
            error
        );
      }
      res.status(500);
    } finally {
      await closeConnection();
    }
  },
  updateMany: async (data) => {
    console.log("---    Updating DB data     ---");
    const connection = await connect();
    if (!connection) return;

    const database = client.db(DB_NAME);
    const collection = database.collection("towary");

    try {
      const promises = data.map(async (user, i) => {
        return collection.updateOne({ nick: user.nick }, [
          { $set: { towaryCurrentSum: user.towaryCurrentSum } },
        ]);
      });
      await Promise.all(promises);

      console.log("Transaction successfully committed.");
      //   return document;
    } catch (error) {
      if (
        error instanceof MongoError &&
        error.hasErrorLabel("UnknownTransactionCommitResult")
      ) {
        // add your logic to retry or handle the error
      } else if (
        error instanceof MongoError &&
        error.hasErrorLabel("TransientTransactionError")
      ) {
        // add your logic to retry or handle the error
      } else {
        console.log(
          "An error occured in the transaction, performing a data rollback:" +
            error
        );
      }
    } finally {
      await closeConnection();
    }
  },
};
