const { Client, Interaction, AttachmentBuilder } = require("discord.js");
const canvacord = require("canvacord");
const GuildModel = require("../../models/GuildSchema");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server");
      return;
    }

    const guildId = interaction.guildId;

    const guild = await GuildModel.findOne({ guildId }).populate(
      "levels",
      "-_id"
    );

    const allLevels = guild.levels;
    if (allLevels.length < 1)
      return interaction.reply({
        content: "There are currently no levels for your server",
        ephemeral: true,
      });
    allLevels.sort((a, b) => {
      if (a.level === b.level) {
        b.xp - a.xp;
      } else return b.level - a.level;
    });

    let leaderBoard = ``;

    for (const [idx, user] of allLevels.entries()) {
      const User = await client.users.fetch(user.userId);

      leaderBoard += `**${idx + 1}.** **${User.globalName}** (Level - ${
        user.level
      }, XP - ${user.xp})\n`;
    }

    await interaction.reply({
      content: `${leaderBoard}`,
      ephemeral: false,
    });
  },
  name: "leaderboard",
  description: "Shows leaderboard for levels",
};
