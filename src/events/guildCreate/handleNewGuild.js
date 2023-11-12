const getLocalCommands = require("../../utils/getLocalCommands");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const areCommandsDifferent = require("../../utils/areCommandsDifferent");

module.exports = async (client, guild) => {
  console.log("NEW GUILD JOINED");
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
  } catch (error) {
    console.log(error);
  }
};
