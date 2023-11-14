const { Client, Interaction } = require("discord.js");
const Level = require("../../models/Level");
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
    await interaction.deferReply({
      ephermeral: true,
    });

    const guildId = interaction.guildId;

    const isChannelAvailable = await GuildModel.findOne({ guildId }).populate(
      "levels",
      "-_id"
    );

    if (isChannelAvailable?.levelLogChannelId === null) {
      return await interaction.editReply({
        content:
          "No channel have been setup for log! Use /setup-level to set a channel",
        ephermeral: true,
      });
    }

    const allLevels = isChannelAvailable.levels;
    if (allLevels.length < 1)
      return interaction.editReply({
        content: "There are currently 0 levels for your server",
        ephermeral: true,
      });

    // if (!level) {
    //   await interaction.editReply(
    //     "The user have not send any messages into guild or it is a bot"
    //   );
    //   return;
    // }

    // let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
    //   "-_id userId level xp"
    // );

    // allLevels.sort((a, b) => {
    //   if (a.level === b.level) {
    //     b.xp - a.xp;
    //   } else return b.level - a.level;
    // });

    // let curRank = allLevels.findIndex((obj) => obj.userId === userId) + 1;
    // const rank = new canvacord.Rank()
    //   .setAvatar(targetUser.user.displayAvatarURL({ size: 128 }))
    //   .setRank(curRank)
    //   .setLevel(level.level)
    //   .setCurrentXP(level.xp)
    //   .setRequiredXP(calculateLevelXp(level.level))
    //   .setStatus(targetUser.presence.status)
    //   .setProgressBar("#FFC300", "COLOR")
    //   .setUsername(targetUser.user.username);

    // const data = await rank.build();
    // const attachment = new AttachmentBuilder(data);

    // interaction.editReply({ files: [attachment] });
  },
  name: "leaderboard",
  description: "Shows leaderboard for levels",
};
