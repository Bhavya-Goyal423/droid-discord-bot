const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: async (client, interaction) => {
    try {
      console.log(interaction.guild);
    } catch (error) {
      console.log(error);
    }
  },

  name: "unban",
  description: "unbans a member from the server",
  options: [
    {
      name: "target-user",
      description: "The user you want to ban",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "dm",
      description: "Sends a custom reason to the user",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
