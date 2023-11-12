const path = require("path");
const getAllFiles = require("./getAllFiles");

module.exports = (exceptions = []) => {
  let localCommands = [];

  const commandsCategory = getAllFiles(
    path.join(__dirname, "..", "commands"),
    true
  );

  for (const commandCat of commandsCategory) {
    const commandFiles = getAllFiles(commandCat);

    for (const commandFile of commandFiles) {
      const commandObject = require(commandFile);
      if (exceptions.includes(commandObject.name)) continue;
      localCommands.push(commandObject);
    }
  }

  return localCommands;
};
