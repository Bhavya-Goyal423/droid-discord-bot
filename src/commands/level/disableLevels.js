const {
  PermissionFlagsBits,
  Client,
  Interactions,
  ApplicationCommandOptionType,
} = require("discord.js");

module.exports = {
  callback: (client, interaction) => {},

  name: "disable-levels",
  description: "Disable the levels",
  options: [
    {
      name: "reset",
      description: "state whether to reset the levels",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageChannels],
  botPermissions: [PermissionFlagsBits.ManageChannels],
};
