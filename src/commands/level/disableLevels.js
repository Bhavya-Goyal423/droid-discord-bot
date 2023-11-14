const { PermissionFlagsBits, Client, Interaction } = require("discord.js");
const GuildModel = require("../../models/GuildSchema");
const Level = require("../../models/Level");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    await interaction.deferReply({ ephemeral: true });

    try {
      const guildId = interaction.guildId;
      await GuildModel.findOneAndUpdate(
        { guildId },
        { levels: [], levelLogChannelId: null }
      );
      await Level.deleteMany({ guildId });
      await interaction.editReply({
        content: "Levels disabled ✅",
        ephemeral: true,
      });
    } catch (error) {
      await interaction.editReply({
        content: `Error: ${error.message}`,
        ephemeral: true,
      });
    }
  },

  name: "disable-levels",
  description: "Disable the levels (Note: This will also reset the levels)",
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
};
