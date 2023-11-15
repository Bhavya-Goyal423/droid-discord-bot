const {
  ApplicationCommandOptionType,
  PermissionFlagsBits,
  Client,
  Interaction,
} = require("discord.js");
const Level = require("../../models/Level");
const GuildSchema = require("../../models/GuildSchema");

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
      const targetUser = interaction.options.get("target-user")?.value;
      const user = await interaction.guild.members.fetch(targetUser);
      if (!targetUser) {
        await Level.updateMany({ guildId }, { level: 1, xp: 0 });
        interaction.editReply({
          content: "Levels reset ✅",
        });
      } else {
        if (user) {
          await Level.findOneAndUpdate(
            { guildId, userId: targetUser },
            { level: 1, xp: 0 }
          );
          interaction.editReply({
            content: `Levels for ${user.user.globalName} has been reseted`,
          });
        } else {
          interaction.editReply({
            content: "User doesn't exist in server",
          });
        }
      }
    } catch (error) {
      console.log(error);
      return;
    }
  },
  name: "reset-levels",
  description: "reset all/specific user levels",
  options: [
    {
      name: "target-user",
      description: "user you want to reset levels",
      type: ApplicationCommandOptionType.Mentionable,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.ManageRoles],
};
