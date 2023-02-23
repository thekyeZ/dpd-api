require("dotenv").config();
const { Client, GatewayIntentBits, Events } = require("discord.js");
// const botConfig = require("../config");
// const { sumUpFromText, resetInvoices } = require("./handlers/fuel");
// const { showBanner } = require("./utils/banner");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on(Events.ClientReady, async () => {
  console.log(`Logged in as ${client.user.tag}`);
  //   const list = await client.guilds.fetch("964966562798915644");
  //   const members = await list.members.fetch();

  //   console.log("memebers");

  //   members.forEach((user) => {
  //     console.log(user.user.avatarURL());
  //   });
});

client.login(process.env.DISCORD_BOT_TOKEN);

module.exports = {
  getUserAvatars: async () => {
    const list = await client.guilds.fetch("964966562798915644");
    const members = await list.members.fetch();

    // console.log("memebers", members);

    members.forEach((m) => {
      //   m.roles.cache.forEach((role) => console.log(role.name))
    });

    return members
      .filter((m) => !m.user.bot)
      .map((e) => ({
        nick: e.user.username,
        avatar: e.user.avatarURL(),
        roles: e.roles.cache
          .filter((role) => role.name != "@everyone")
          .map((role) => role.name),
      }));
  },
};
