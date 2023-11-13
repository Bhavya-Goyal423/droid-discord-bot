const { Schema, model } = require("mongoose");

const levelSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    requried: true,
  },
  xp: {
    type: Number,
    default: 0,
  },
  level: {
    type: Number,
    default: 1,
  },
  channelId: {
    type: String,
    default: null,
  },
});

module.exports = model("Level", levelSchema);
