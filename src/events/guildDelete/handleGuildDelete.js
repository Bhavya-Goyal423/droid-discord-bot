const GuildModel = require("../../models/GuildSchema");
const Level = require("../../models/Level");

module.exports = async (client, guild) => {
  try {
    await GuildModel.findOneAndDelete({ guildId: guild.id });
    await Level.deleteMany({ guildId: guild.id });
    console.log(`Guild ${guild.name} removed from DB`);
  } catch (error) {
    console.log(error);
  }
};
