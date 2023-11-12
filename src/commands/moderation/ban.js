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
      await interaction.editReply("You cant ban the server owner");
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position;

    const requestUserRolePosition = interaction.member.roles.highest.position;

    const botRolePosition = interaction.guild.members.me.roles.highest.position;

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "You cant ban a user who has role above than you."
      );
      return;
    }

    if (targetUserRolePosition > botRolePosition) {
      await interaction.editReply(
        "I cant ban this user as they have similar or higher role than me.Put my role above other roles for proper moderation"
      );
      return;
    }

    try {
      await targetUser.ban({ reason });
      if (dm) {
        const userDm = await targetUser.createDM();
        userDm.send(
          `You have been banned from ${interaction.guild.name} for ${dm}`
        );
      }
      await interaction.editReply(
        `User ${targetUser} was banned\nReason: ${reason}`
      );
    } catch (error) {
      console.log(error);
    }
  },

  name: "ban",
  description: "bans a member from the server",
  options: [
    {
      name: "target-user",
      description: "The user you want to ban",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "Reason for banning the user",
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
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botPermissions: [PermissionFlagsBits.BanMembers],
};
