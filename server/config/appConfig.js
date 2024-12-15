import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

const appConfig = Object.freeze({
  port: process.env.PORT,
  mongo_uri: process.env.MONGO_URI,
});

export default appConfig;
