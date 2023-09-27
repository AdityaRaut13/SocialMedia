/** @format */

const mongoose = require("mongoose");

const { faker } = require("@faker-js/faker");
const tech = require("../Models/Technology");
const users = require("../Models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");
const createMessages = require("./messages");

let choices = [
  "abstract",
  "animals",
  "avatar",
  "business",
  "cats",
  "city",
  "fashion",
  "food",
  "image",
  "imageUrl",
  "nature",
  "nightlife",
  "people",
  "sports",
  "technics",
  "transport",
];

function generateFakerImageUrl() {
  let choice = faker.helpers.arrayElement(choices);
  return faker.image[choice]();
}

function generateFakeProjects() {
  let numP = Math.round(3 * Math.random());
  let projects = [];

  for (let i = 0; i < numP; i++) {
    let title = faker.lorem.sentence();
    let description = faker.lorem.sentences();
    projects.push({ title, description });
  }
  return projects;
}

async function createRandomUser(techID) {
  let username = faker.name.firstName();
  let email = faker.helpers.unique(faker.internet.email, [username]);
  const salt = await bcrypt.genSalt(10);
  const pass = faker.internet.password();
  let password = await bcrypt.hash(pass, salt);
  let bio = faker.lorem.lines(2);
  let workedOn = faker.helpers.arrayElements(techID, 5);
  let interested = faker.helpers.arrayElements(techID, 5);
  let _id = mongoose.Types.ObjectId();
  let profileLink = generateFakerImageUrl();
  let projects = generateFakeProjects();
  return {
    user: {
      _id,
      username,
      email,
      password,
      bio,
      workedOn,
      interested,
      projects,
      profileLink,
    },
    config: {
      pass,
    },
  };
}

async function randomUser(number) {
  let jsonData = JSON.parse(fs.readFileSync("technology.json"));
  tech.insertMany(jsonData, async (err) => {
    if (err) {
      console.log(err.message);
      process.exit(1);
    }
    let t = await tech.find();
    console.log(t);
    let techID = t.map((value) => value._id);
    try {
      for (let i = 0; i < number; i++) {
        let result = await createRandomUser(techID);
        let isThere = await users.findOne({
          username: result.user.username,
        });
        isThere =
          isThere || (await users.findOne({ email: result.user.email }));
        while (isThere) {
          result = await createRandomUser(techID);
          isThere = await users.findOne({
            username: result.user.username,
          });
          isThere =
            isThere || (await users.findOne({ email: result.user.email }));
        }
        const content =
          [result.user.email, result.config.pass, result.user.username].join(
            ","
          ) + "\n";
        fs.appendFileSync("user.csv", content);
        await users.create(result.user);
      }
      await createMessages();
    } catch (error) {
      console.log(error.message);
    } finally {
      await mongoose.connection.close();
    }
  });
}

module.exports = randomUser;
