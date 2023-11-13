const {
  ApplicationCommandOptionType,
  AttachmentBuilder,
} = require("discord.js");
const Level = require("../../models/Level");
const canvacord = require("canvacord");
const calculateLevelXp = require("../../utils/calculateLevelXp");

module.exports = {
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) {
      interaction.reply("You can only run this command inside a server");
      return;
    }
    await interaction.deferReply({
      ephermeral: true,
    });

    const guildId = interaction.guildId;
    const userId = interaction.options.get("target-user").value;
    const targetUser = await interaction.guild.members.fetch(userId);
    const query = { userId, guildId };

    const level = await Level.findOne(query);

    if (!level) {
      await interaction.editReply(
        "The user have not send any messages into guild or it is a bot"
      );
    }

    let allLevels = await Level.find({ guildId: interaction.guild.id }).select(
      "-_id userId level xp"
    );

    let curRank = allLevels.findIndex((obj) => obj.userId === userId) + 1;
    const rank = new canvacord.Rank()
      .setAvatar(targetUser.user.displayAvatarURL({ size: 128 }))
      .setRank(curRank)
      .setLevel(level.level)
      .setCurrentXP(level.xp)
      .setRequiredXP(calculateLevelXp(level.level))
      .setStatus(targetUser.presence.status)
      .setProgressBar("#FFC300", "COLOR")
      .setUsername(targetUser.user.username);

    const data = await rank.build();
    const attachment = new AttachmentBuilder(data);

    interaction.editReply({ files: [attachment] });
  },

  name: "level",
  description: "Shows your/someone's level",
  options: [
    {
      name: "target-user",
      description: "User whose level you want to see",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
  ],
};
