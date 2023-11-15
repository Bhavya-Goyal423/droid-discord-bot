const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

const GuildModel = require("../../models/GuildSchema");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const guildId = interaction.guildId;

    await interaction.deferReply({ ephemeral: true });

    try {
      const guild = await GuildModel.findOne({ guildId });
      const welcome = Object.fromEntries(guild.welcome);

      guild.welcome = { ...welcome, message: null };
      await guild.save();

      return await interaction.editReply({
        content: "Welcome message removed",
      });
    } catch (error) {
      console.log(error);
    }
  },
  name: "remove-welcomemessage",
  description: "remove the welcome message",

  permissionsRequired: [
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageGuild,
  ],
};
