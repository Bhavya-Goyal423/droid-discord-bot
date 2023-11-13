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
    await interaction.deferReply();
    const channelId = interaction.options.get("channel-id").value;
    console.log(channelId);

    try {
      const updatedLogChannel = await GuildModel.findOneAndUpdate(
        { guildId: interaction.guildId },
        { levelLogChannelId: channelId },
        { new: true }
      );

      await interaction.editReply(
        `✅ Channel set as log channel for levels. To remove it use '/unsetup-level'`
      );
      return;
    } catch (error) {
      console.log(error);
      await interaction.editReply(
        `❌ There was error in setting the log channel\nReason ${JSON.stringify(
          error.message
        )}`
      );
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
  permissionsRequired: [PermissionFlagsBits.ManageGuild],
};
