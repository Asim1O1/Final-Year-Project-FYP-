import app from "./app.js";
import appConfig from "./config/appConfig.js";
import initializeDbConnection from "./config/connectToDB.js";

const port = appConfig.port;

const initializeServer = async () => {
  try {
    // connect to the database
    await initializeDbConnection();

    // Start the server
    app.listen(port, () => {
      console.log(`Server is up and running at http://localhost:${port}...`);
    });
  } catch (error) {
    console.error("Error while starting the server:", error);
    process.exit(1); 
  }
};




initializeServer();
