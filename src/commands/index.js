const fs = require('fs');
const path = require('path');
const { REST, Routes } = require('discord.js');
const logger = require('../config/logger')
/**
 * Load commands and register them with Discord.
 * @param {Client} client  Discord.js client
 */
const loadAndRegisterCommands = async (client) => {
    const commands = [];
    client.commands = new Map();

    // Dynamically read all command files
    const commandFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.js') && file !== 'index.js');

    for (const file of commandFiles) {
        const command = require(path.join(__dirname, file));
        client.commands.set(command.name, command);

        // Prepare the command data for Discord
        commands.push({
            name: command.name,
            description: command.description,
            options: command.options || [],
        });

    }

    // Register commands with Discord
    try {
        logger.info('Registring slash commands..')
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        console.log(commands)
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands }
        );

        logger.info('Slash commands registered successfully!');
    } catch (error) {
        logger.error('Failed to register commands:', error);
    }
}

module.exports = loadAndRegisterCommands;
