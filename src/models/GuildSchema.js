const { Schema, model } = require("mongoose");

const guildScehma = new Schema({
  guildId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  user: {
    type: Map,
    of: String,
    required: true,
  },
  levelLogChannelId: { type: String, default: null },
});
module.exports = model("Guild", guildScehma);
