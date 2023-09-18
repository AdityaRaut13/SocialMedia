/** @format */

const express = require("express");
require("dotenv").config({ path: ".env" });
const morgan = require("morgan");
const cors = require("cors");

require("./backend/config/db")(); // initialise database
//require("./backend/config/initial")(50); // make some random users.
const webSocketServer = require("./backend/webSocket/socket");

const PORT = process.env.PORT || 5000;

const app = express();
const httpServer = webSocketServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());
app.use(morgan("combined"));

app.use("/images", express.static(process.env.FILE_STORAGE));

app.use("/api/user", require("./backend/Routes/userRoutes"));
app.use("/api/tech", require("./backend/Routes/techRoutes"));

httpServer.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
