/** @format */

const mongoose = require("mongoose");

const { faker } = require("@faker-js/faker");
const tech = require("../Models/Technology");
const users = require("../Models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");

async function createRandomUser(techID) {
  let username = faker.name.fullName();
  let email = faker.helpers.unique(faker.internet.email, [username]);
  const salt = await bcrypt.genSalt(10);
  let password = await bcrypt.hash(faker.internet.password(), salt);
  let bio = faker.lorem.paragraph();
  let workedOn = faker.helpers.arrayElements(techID, 5);
  let interested = faker.helpers.arrayElements(techID, 5);
  let _id = mongoose.Types.ObjectId();
  //let numP = Math.round(3 * Math.random());
  // let projects = [];
  //
  // for (let i = 0; i < numP; i++) {
  // let title = faker.lorem.sentence();
  // let description = faker.lorem.sentences();
  // projects.push({ title, description });
  // }
  return {
    _id,
    username,
    email,
    password,
    bio,
    workedOn,
    interested,
    //  projects,
  };
}

async function randomUser(number) {
  let jsonData = JSON.parse(fs.readFileSync("technology.json"));
  tech.insertMany(jsonData, async (err) => {
    let t = await tech.find();
    console.log(t);
    let techID = t.map((value) => value._id);
    for (let i = 0; i < number; i++) {
      await users.create(await createRandomUser(techID));
    }
  });
}

module.exports = randomUser;
