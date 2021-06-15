import { Client, Collection, Message } from "discord.js";
import { readdir } from "fs";
import {
  banIllegalNames,
  serverProtectionRoleCheck,
} from "./features/banIllegalNames";
import { RunEvent } from "./interfaces";
import { checkForCreeps } from "./services/channel.service";
import { logger } from "./util/logger";

require("dotenv").config();

const client = new Client();
const PREFIX = "##";
const BOT_TOKEN = process.env.BOT_TOKEN;

const commands: Collection<string[], (event: RunEvent) => any> =
  new Collection();
const PATH = "./src/commands";
const COMMAND_SOURCE_PATH = "./commands";

readdir(`${PATH}`, (err, filesInDir) => {
  if (err) {
    logger.error(err);
  }

  const files = filesInDir.map((fileString) => fileString.split(".")[0]);

  if (files.length <= 0) {
    logger.info("No commands found!");
  } else {
    for (let fileString of files) {
      const pathToFile = `${COMMAND_SOURCE_PATH}/${fileString}`;

      const props = require(pathToFile) as {
        names: string[];
        run: (event: RunEvent) => any;
      };
      commands.set(props.names, props.run);
    }
  }
});

client.on("ready", () => {
  client.guilds.cache.forEach((guild) => serverProtectionRoleCheck(guild));

  setInterval(() => {
    client.guilds.cache.forEach((guild) => {
      checkForCreeps(guild);
    });
  }, 1000);

  console.log(`Logged in as ${client?.user?.tag}!`);
});

client.on("message", async (message: Message) => {
  const channels = await message.guild?.channels.cache;
  if (!channels) return;
  channels.forEach((channel) => {
    channel.members.forEach((member) => {
      "".split("").includes;
      const voice = member.voice;
      console.log(`Status: ${voice.selfVideo}`);
    });
  });

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
  } else {
    commandRunnable({
      message,
      args,
      client,
    });
  }
});

client.on("guildMemberAdd", async (member) => {
  const userId = member.user.id;
  const guildMember = member;
  banIllegalNames([userId, guildMember]);
});

client.login(BOT_TOKEN);

module.exports = { client: client };
