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
    const message = interaction.options.get("message").value;
    await interaction.deferReply({ ephemeral: true });

    if (!message.includes("{user}")) {
      return await interaction.editReply({
        content:
          "No placeholder for user set, set message with inserting '{user}' in your message as placeholder for user",
      });
    }

    try {
      const guild = await GuildModel.findOne({ guildId });
      const welcome = Object.fromEntries(guild.welcome);

      guild.welcome = { ...welcome, message };
      await guild.save();

      return await interaction.editReply({
        content: "Welcome message set",
      });
    } catch (error) {
      console.log(error);
    }
  },
  name: "set-welcomemessage",
  description: "set the welcome message whenever a user joins the server",
  options: [
    {
      name: "message",
      description: "message you want to display",
      required: true,
      type: ApplicationCommandOptionType.String,
    },
  ],

  permissionsRequired: [
    PermissionFlagsBits.ManageChannels,
    PermissionFlagsBits.ManageGuild,
  ],
};
