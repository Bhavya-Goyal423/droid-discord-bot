const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
  PermissionFlagsBits,
} = require("discord.js");
const LevelModel = require("../../models/Level");
const GuildModel = require("../../models/GuildSchema");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    await interaction.deferReply({ ephemeral: true });
    const channelId = interaction.options.get("channel-id").value;

    try {
      await GuildModel.findOneAndUpdate(
        { guildId: interaction.guildId },
        { levelLogChannelId: channelId }
      );

      await interaction.editReply({
        content: `✅ Channel set as log channel for levels. To remove it use '/disable-levels'`,
        ephemeral: true,
      });
      return;
    } catch (error) {
      console.log(error);
      await interaction.editReply({
        content: `❌ There was error in setting the log channel\nReason ${JSON.stringify(
          error.message
        )}`,
        ephemeral: true,
      });
      return;
    }
  },
  name: "setup-level",
  description: "Setup a channel for level logs",
  options: [
    {
      name: "channel-id",
      description: "Specific channel you want to setup logs",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
};
