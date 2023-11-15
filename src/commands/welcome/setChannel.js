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
    const channelId = interaction.options.get("channel-id").value;
    await interaction.deferReply({ ephemeral: true });

    let channelPresent = false;

    try {
      const guild = await GuildModel.findOne({ guildId });
      const welcome = Object.fromEntries(guild.welcome);
      if (welcome.channelId) channelPresent = true;
      guild.welcome = { ...welcome, channelId };
      await guild.save();
      if (channelPresent)
        return await interaction.editReply({
          content: "Welcome channel updated",
        });
      return await interaction.editReply({
        content: "Welcome channel set",
      });
    } catch (error) {
      console.log(error);
    }
  },
  name: "set-welcomechannel",
  description: "sets the channel to log welcome messages",
  options: [
    {
      name: "channel-id",
      description: "channel to log welcome messages",
      type: ApplicationCommandOptionType.Channel,
      required: true,
    },
  ],
  permissionsRequired: [
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageGuild,
  ],
};
