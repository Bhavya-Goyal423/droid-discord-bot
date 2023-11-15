const {
  Client,
  Interaction,
  PermissionFlagsBits,
  ApplicationCommandOptionType,
} = require("discord.js");

const GuildModel = require("../../models/GuildSchema");

module.exports = {
  /**
   *
   * @param {Client} client
   * @param {Interaction} intercation
   */
  callback: async (client, interaction) => {
    if (!interaction.inGuild()) return;
    await interaction.deferReply({ ephemeral: true });

    try {
      const guildId = interaction.guildId;

      const guild = await GuildModel.findOne({ guildId });
      const guildWelcome = Object.fromEntries(guild.welcome);

      guild.welcome = { ...guildWelcome, roleId: null };
      await guild.save();

      await interaction.editReply({
        content: "Autorole Disabled",
      });
    } catch (error) {
      console.log(error);
    }
  },
  name: "disable-autorole",
  description: "Auto role for whenever a user joins the server",
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
};
