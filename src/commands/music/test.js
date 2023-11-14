module.exports = {
  name: "play",
  description: "plays a song",

  callback: async (client, interaction) => {
    console.log(interaction.member.voice.channel.id);
  },
};
