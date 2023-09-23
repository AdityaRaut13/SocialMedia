/** @format */

const Users = require("../Models/User");
const Messages = require("../Models/Message");
const { faker } = require("@faker-js/faker");

async function CreateMessage() {
  try {
    const users = await Users.find({});
    for (const senderKey in users) {
      for (const receiverKey in users) {
        let message = faker.lorem.lines();
        await Messages.create({
          sender: users[senderKey].id,
          receiver: users[receiverKey].id,
          message,
        });
      }
    }
  } catch (e) {
    console.log(e.message);
  }
}

module.exports = CreateMessage;
