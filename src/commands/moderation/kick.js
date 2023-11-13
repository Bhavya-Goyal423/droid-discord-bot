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
    const targetUserId = interaction.options.get("target-user").value;
    const reason = interaction.options.get("reason")?.value;
    const dm = interaction.options.get("dm")?.value;

    await interaction.deferReply({
      ephermeral: true,
    });

    const targetUser = await interaction.guild.members.fetch(targetUserId);

    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in the server");
      return;
    }

    if (targetUser.id === interaction.guild.ownerId) {
      await interaction.editReply("You cant kick the server owner");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;
    const requestUserRolePosition = interaction.member.roles.highest.position;
    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You cant kick a user who has role same/higher than you."
      );
      return;
    }

    if (targetUserRolePosition > botRolePosition) {
      await interaction.editReply(
        "I cant kick this user as they have similar/higher role than me.Put my role above other roles for proper moderation"
      );
      return;
    }

    try {
      await targetUser.kick({ reason });
      if (dm) {
        const userDm = await targetUser.createDM();
        userDm.send(
          `You have been kicked from ${interaction.guild.name} for ${dm}`
        );
      }
      await interaction.editReply(
        `User ${targetUser} was kicked\nReason: ${reason}`
      );
    } catch (error) {
      console.log(error);
    }
  },

  name: "kick",
  description: "kicks a member from the server",
  options: [
    {
      name: "target-user",
      description: "The user you want to kick",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "Reason for kicking the user",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
    {
      name: "dm",
      description: "Sends a custom reason to the user",
      required: false,
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.KickMembers],
  botPermissions: [PermissionFlagsBits.KickMembers],
};
