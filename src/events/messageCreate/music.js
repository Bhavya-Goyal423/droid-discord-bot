module.exports = async (client, message) => {
  console.log(message.content);
  if (!message.inGuild() || message.author.bot) return;

  try {
    // Fetch the member to get the latest information
    const User = await message.member.fetch();
    console.log(User.voice.channelId);

    // Check if the member is in a voice channel
    if (
      message.member &&
      message.member.voice &&
      message.member.voice.channel
    ) {
      console.log("User is in a voice channel");
    } else {
      console.log("User is not in a voice channel");
    }
  } catch (error) {
    console.error("Error fetching member:", error);
  }
};
