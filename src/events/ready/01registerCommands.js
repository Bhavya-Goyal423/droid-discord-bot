const areCommandsDifferent = require("../../utils/areCommandsDifferent");
const getApplicationCommands = require("../../utils/getApplicationCommands");
const getLocalCommands = require("../../utils/getLocalCommands");
const GuildModel = require("../../models/GuildSchema");

module.exports = async (client) => {
  try {
    const allServers = await GuildModel.find({});

    for (const server of allServers) {
      console.log(`registering command for ${server.name}`);
      const localCommands = getLocalCommands();
      const applicationCommands = await getApplicationCommands(
        client,
        server.guildId
      );

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
            console.log("Edited command", name, "\n");
          }
        } else {
          if (localCommand.deleted) {
            console.log(
              `Skipping regitering command ${name} as it's set to deleted`
            );
            continue;
          }
          await applicationCommands.create({ name, description, options });
          console.log(`Registered command ${name}`);
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};
