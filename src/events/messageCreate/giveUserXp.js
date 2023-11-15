const { Client, Message } = require("discord.js");
const Level = require("../../models/Level");
const calculateLevelXp = require("../../utils/calculateLevelXp");
const cooldown = new Set();
const GuildModel = require("../../models/GuildSchema");

/**
 *
 * @param {Client} client
 * @param {Message} message
 */

function getRandomXp(min, max) {
  min = Math.ceil(min);
  max = Math.ceil(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = async (client, message) => {
  if (
    !message.inGuild() ||
    message.author.bot ||
    cooldown.has(message.author.id + message.guild.id) ||
    message.content.startsWith("!dr")
  )
    return;

  const guildName = client.guilds.cache.get(message.guildId).name;

  const isChannelAvailable = await GuildModel.findOne({
    guildId: message.guildId,
  });

  if (isChannelAvailable.levelLogChannelId === null) return;

  const guild = message.guild;

  const targetChannel = guild.channels.cache.get(
    isChannelAvailable.levelLogChannelId
  );

  const xpToGive = getRandomXp(5, 15);

  const query = {
    userId: message.author.id,
    guildId: message.guild.id,
  };

  try {
    const level = await Level.findOne(query);

    if (level) {
      level.xp += xpToGive;
      if (level.xp > calculateLevelXp(level.level)) {
        level.xp = 0;
        level.level += 1;

        if (targetChannel) {
          await targetChannel.send(
            `${message.member} you have advanced to **level ${level.level}**. 🥳`
          );
        } else return;
      }
      await level.save().catch((e) => {
        console.log(e);
        return;
      });
      cooldown.add(message.author.id + message.guild.id);
      setTimeout(() => {
        cooldown.delete(message.author.id + message.guild.id);
      }, 10);
    } else {
      const newLevel = new Level({
        userId: message.author.id,
        guildId: message.guild.id,
        xp: xpToGive,
        username: message.author.username,
        guildName,
      });
      const result = await newLevel.save().catch((e) => {
        console.log(e);
      });

      isChannelAvailable.levels.push(result._id);
      await isChannelAvailable.save();
    }
  } catch (error) {
    console.log(error);
  }
};
