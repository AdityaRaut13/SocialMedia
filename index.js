/** @format */

const express = require("express");
require("dotenv").config({ path: ".env" });
const morgan = require("morgan");

require("./backend/config/db")(); // initialise database
//require("./backend/config/initial")(50); // make some random users.

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("combined"));

app.use("/api/user", require("./backend/Routes/userRoutes"));
app.use("/api/tech",require("./backend/Routes/techRoutes"));

app.listen(PORT, () => console.log(`http://localhost:${PORT}/`));
