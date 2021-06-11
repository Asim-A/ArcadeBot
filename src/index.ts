import { Client, Collection, Message } from "discord.js";
import { readdir } from "fs";
import { banIllageNames } from "./features/banIllegalNames";
import { RunEvent } from "./interfaces/interfaces";

require("dotenv").config();

const client = new Client();
const PREFIX = "##";
const BOT_TOKEN = process.env.BOT_TOKEN;
const commands: Collection<string[], (event: RunEvent) => any> =
  new Collection();

readdir("./commands/", (err, filesInDir) => {
  if (err) console.log(err);
  let files = filesInDir.filter((f) => f.split(".").pop());

  if (filesInDir.length <= 0) {
    console.log("No commands found!");
  } else {
    for (let file of files) {
      const props = require(`./commands/${file}`) as {
        names: string[];
        run: (event: RunEvent) => any;
      };
      commands.set(props.names, props.run);
    }
  }
});

client.once("ready", () => {
  console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on("message", async (message: Message) => {
  if (
    message.channel.type === "dm" ||
    message.author.bot ||
    !message.content.startsWith(PREFIX)
  ) {
    return;
  }

  const args = message.content.split(/ +/);
  if (args.length < 1) {
    return;
  }

  const command = args.shift()!.toLowerCase().slice(PREFIX.length);
  const commandRunnable = commands.find((_, n) => n.includes(command));

  if (!commandRunnable) {
    return;
  } else
    commandRunnable({
      message,
      args,
      client,
    });
});

client.on("guildMemberAdd", async (member) => {
  const userId = member.user.id;
  const guildMember = member;

  banIllageNames([userId, guildMember]);
});

client.login(BOT_TOKEN);

module.exports = { client: client };
