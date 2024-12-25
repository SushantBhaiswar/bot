const { Client, GatewayIntentBits } = require('discord.js');
const config = require('./config/config');
const logger = require('./config/logger');
const loadAndRegisterCommands = require('./commands');
const handleInteraction = require('./handler/interactionHandler');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Log when the bot is ready
client.once('ready', async () => {
    logger.info('Bot is online!');
    await loadAndRegisterCommands(client);
});

// Handle incoming interactions
client.on('interactionCreate', async (interaction) => {
    try {
        await handleInteraction(interaction, client);
    } catch (error) {
        logger.error(`Error handling interaction: ${error.message}`);
        if (interaction.isRepliable()) {
            interaction.reply({ content: 'An error occurred!', ephemeral: true });
        }
    }
});

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`);
    process.exit(1);
});
process.on('unhandledRejection', (error) => {
    logger.error(`Unhandled Rejection: ${error}`);
    process.exit(1);
});

// Graceful shutdown on SIGTERM
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down...');
    client.destroy();
    process.exit(0);
});

client.login(config.discord.token);
