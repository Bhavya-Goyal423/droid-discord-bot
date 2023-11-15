const { Schema, model } = require("mongoose");
const mongoose = require("mongoose");

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
  levels: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Level" }],
    default: [],
  },
  welcome: {
    type: Map,
    of: String,
    default: { roleId: null, channelId: null, message: null },
  },
});
module.exports = model("Guild", guildScehma);
