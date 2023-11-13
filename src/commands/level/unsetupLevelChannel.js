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
    const guildId = interaction.guildId;
    const guild = await GuildModel.findOne({ guildId });

    const reset = interaction.options.get("reset").value;

    if (!reset) {
      guild.levelLogChannelId = null;
      guild.save();
    }
  },
  name: "disable-levels",
  description: "Disable's the level system",
  options: [
    {
      name: "reset",
      description: "state whether you want to reset all the levels",
      type: ApplicationCommandOptionType.Boolean,
      required: true,
      choices: [
        { name: "true", value: true },
        { name: "false", value: false },
      ],
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageGuild],
};
