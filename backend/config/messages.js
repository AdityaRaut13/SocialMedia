const mongoose = require("mongoose");
const Users = require("../Models/User");
const Messages = require("../Models/Message");
const { faker } = require("@faker-js/faker");

async function CreateMessage() {
  try {
    const users = await Users.find({});
    for (const senderKey in users) {
      for (const recieverKey in users) {
        let message = faker.lorem.lines();
        await Messages.create({
          sender: users[senderKey].id,
          reciever: users[recieverKey].id,
          message,
        });
      }
    }
  } catch (e) {
    console.log(e.message);
  } finally {
    await mongoose.connection.close();
  }
}

module.exports = CreateMessage;
