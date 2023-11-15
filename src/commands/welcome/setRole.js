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

    let rolePresent = false;

    try {
      const guildId = interaction.guildId;
      const roleId = interaction.options.get("role-id").value;
      const curGuild = interaction.guild;

      const roleToGive = curGuild.roles.cache.find(
        (role) => role.id === roleId
      );

      const botRolePosition =
        interaction.guild.members.me.roles.highest.position;

      if (botRolePosition <= roleToGive.position)
        return interaction.editReply(
          "Role not set\nReason: Specified role has same/higher position than my role"
        );

      const guild = await GuildModel.findOne({ guildId });
      const guildWelcome = Object.fromEntries(guild.welcome);
      if (guildWelcome.roleId) rolePresent = true;
      guild.welcome = { ...guildWelcome, roleId };
      await guild.save();
      if (!rolePresent) {
        await interaction.editReply({
          content: "Autorole Enabled",
        });
      } else {
        await interaction.editReply({
          content: "Autorole Updated",
        });
      }
    } catch (error) {
      console.log(error);
    }
  },
  name: "set-autorole",
  description: "Auto role for whenever a user joins the server",
  options: [
    {
      name: "role-id",
      description: "role you want to set",
      required: true,
      type: ApplicationCommandOptionType.Role,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
};
