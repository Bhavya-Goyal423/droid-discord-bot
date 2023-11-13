const { ApplicationCommandOptionType } = require("discord.js");
const Level = require("../../models/Level");

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
    const query = { userId, guildId };

    const level = await Level.findOne(query);

    if (level) {
      await interaction.editReply(
        `The user is currently at level${level.level}`
      );
      return;
    } else {
      await interaction.editReply(
        "The user have not send any messages into guild or it is a bot"
      );
    }
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
