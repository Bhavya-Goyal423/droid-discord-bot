const getLocalCommands = require("../../utils/getLocalCommands");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const GuildModel = require("../../models/GuildSchema");

module.exports = async (client, guild) => {
  const ownerId = guild.ownerId;
  const ownerDetails = await guild.members.fetch(ownerId);
  const { id, username, globalName, discriminator } = ownerDetails.user;

  try {
    await GuildModel.create({
      guildId: guild.id,
      name: guild.name,
      user: { id, username, globalName, discriminator },
    });
  } catch (error) {
    console.log(error);
  }

  try {
    const localCommands = getLocalCommands();
    const applicationCommands = await getApplicationCommands(client, guild.id);

    for (const localCommand of localCommands) {
      const { name, description, options } = localCommand;

      const existingCommand = await applicationCommands.cache.find(
        (cmd) => cmd.name === name
      );

      if (existingCommand) {
        if (localCommand.deleted) {
          await applicationCommands.delete(existingCommand.id);
          console.log(`Deleted command ${name}.`);
          break;
        }

        if (areCommandsDifferent(existingCommand, localCommand)) {
          await applicationCommands.edit(existingCommand.id, {
            description,
            options,
          });
          console.log("Edited command ", name);
        }
      } else {
        if (localCommand.deleted) {
          console.log(
            `Skipping resitering command ${name} as it's set to deleted`
          );
          continue;
        }
        await applicationCommands.create({ name, description, options });
        console.log(`Registered command ${name}`);
      }
    }
    console.log("\nAll Commands Registered");
  } catch (error) {
    console.log(error);
  }
};
