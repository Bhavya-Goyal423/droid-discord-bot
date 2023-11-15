const AUTOROLEID = "1174205135283552287";
const CHANNELID = "1126632478417899572";
const MESSAGE = `Welcome {user} to Web Design/Development.Make sure to checkout {c-1126632743074283561} and {c-1126634776720322630}`;

module.exports = async (client, member) => {
  member.roles.add(AUTOROLEID);
  const regex = /\{c-(\d+)\}/g;
  const welcomeMessage = MESSAGE.replace("{user}", member).replace(
    regex,
    (match, channelId) => `<#${channelId}>`
  );
  const channel = client.channels.cache.get(CHANNELID);
  if (channel) {
    channel.send(welcomeMessage);
  }
  return;
};
