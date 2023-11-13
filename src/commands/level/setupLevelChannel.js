const {
  ApplicationCommandOptionType,
  Client,
  Interaction,
} = require("discord.js");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  callback: (client, interaction) => {
    if (!interaction.inGuild()) return;
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
};
