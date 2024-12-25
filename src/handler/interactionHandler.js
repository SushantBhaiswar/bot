const logger = require('../config/logger');

module.exports = async (interaction, client) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);

    if (!command) {
        logger.warn(`Unrecognized command: ${interaction.commandName}`);
        await interaction.reply({ content: 'Command not found!', ephemeral: true });
        return;
    }

    logger.info(`Executing command: ${interaction.commandName} by user: ${interaction.user.tag}`);

    try {
        await command.execute(interaction);
    } catch (error) {
        logger.error(`Error executing command ${interaction.commandName}: ${error.message}`);
        await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
    }
};
