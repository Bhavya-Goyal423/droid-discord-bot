const GuildModel = require("../../models/GuildSchema");

module.exports = async (client, member) => {
  try {
    const guild = await GuildModel.findOne({ guildId: member.guild.id });
    const { roleId, channelId, message } = Object.fromEntries(guild.welcome);

    if (channelId && message) {
      const channel = client.channels.cache.get(channelId);
      if (!channel) return;

      const regex = /\{c-(\d+)\}/g;
      const welcomeMessage = message
        .replace("{user}", member)
        .replace(regex, (match, channelId) => `<#${channelId}>`);

      channel.send(welcomeMessage);
    }

    if (roleId) {
      member.roles.add(roleId);
    }
    return;
  } catch (error) {
    console.log(error);
  }
};
