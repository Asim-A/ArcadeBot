const Discord = require("discord.js");
const client = new Discord.Client();

require("dotenv").config();

const prefix = "##";
const BOT_TOKEN = process.env.BOT_TOKEN;

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("message", (msg) => {
  hasPrefix(msg);

  const args = getArgs(msg.content);

  handleArgs(args, msg);
});

client.on("guildMemberAdd", (member) => {
  const { displayName, nickname } = member;
  if (isHonde(displayName) || isHonde(nickname)) {
    member.ban({ days: 7 });
  }
  console.log(`displayName: ${displayName}\nnickname: ${nickname}`);
  console.log(member);
});

client.login(BOT_TOKEN);

const matchName = (name, match) => {
  if (name == null) {
    return false;
  }
  const lName = name.toLocaleLowerCase();
  return lName.includes(match);
};

const isHonde = (name) => {
  return matchName(name, "h0nde");
};

const isTwitter = (name) => {
  return matchName(name, "twitter");
};

const hasPrefix = (message) => {
  const { content, author } = message;
  const isPrefix = content.startsWith(prefix);
  const isBot = author.bot;
  if (!isPrefix || isBot) {
    return;
  }
};

const splitAtFirstSpace = (str) => {
  if (!str) return [];
  var i = str.indexOf(" ");
  if (i > 0) {
    return [str.substring(0, i), str.substring(i + 1)];
  } else return [str];
};

const getArgs = (msgContent) => {
  const trimmed = msgContent.slice(prefix.length).trim();
  return splitAtFirstSpace(trimmed);
};

const handleArgs = (args, msg) => {
  const command = args[0];
  const data = args[1];
  const members = msg.guild.members.cache;

  if (command === "confirm") {
    msg.reply("Bot Working!");
  }

  if (command === "purge") {
    const hasBanPermissions = msg.member.hasPermission(["BAN_MEMBERS"]);
    if (!hasBanPermissions) {
      msg.reply("You have insufficient permission.");
    }

    const bannedPeople = [];

    for (const member of members) {
      const userId = member[0];
      const user = member[1];
      const actualUser = user.user;

      const todaysDate = new Date();
      const usersDate = new Date(actualUser.createdAt);
      const diffDay = dateDiffInDays(usersDate, todaysDate);

      const displayName = user.displayName;
      const nickname = user.nickname;

      const dis = isHonde(displayName);
      const nick = isHonde(nickname);

      console.log(
        `Person ${displayName}, createdAt: ${usersDate}, diff: ${diffDay}`
      );
      if (dis || (nick && diffDay > 30)) {
        bannedPeople.push({ userId, displayName, nickname });
        user.ban({ days: 7 });
      }
    }
    const bLen = bannedPeople.length;
    if (bLen == 0) {
      msg.reply(`There were no users worth banning.`);
    } else {
      msg.reply(`There were ${bLen} user found worth banning.\n Cya!`);
    }
  }
};

const dateDiffInDays = (a, b) => {
  const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
  const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

  return Math.floor((utc2 - utc1) / _MS_PER_DAY);
};

const logUsername = (member) => {
  console.log(
    `displayName: ${member.displayName}\nnickname: ${member.nickname}`
  );
};
