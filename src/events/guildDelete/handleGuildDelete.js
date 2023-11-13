const GuildModel = require("../../models/GuildSchema");

module.exports = async (client, guild) => {
  try {
    await GuildModel.findOneAndDelete({ guildId: guild.id });
    console.log(`Guild ${guild.name} removed from DB`);
  } catch (error) {
    console.log(error);
  }
};
