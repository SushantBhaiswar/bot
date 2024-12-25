const { EmbedBuilder } = require('discord.js');

/**
 * Sends a success message with an embed.
 * @param {Object} interaction - The interaction object.
 * @param {string} title - The title of the embed (e.g., success message).
 * @param {string} description - The description/content of the embed.
 */
const sendSuccessMessage = async (interaction, title, description) => {
    const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
};

/**
 * Sends an error message with an embed.
 * @param {Object} interaction - The interaction object.
 * @param {string} title - The title of the embed (e.g., error message).
 * @param {string} description - The description/content of the embed.
 */
const sendErrorMessage = async (interaction, title = 'Error', description) => {
    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(title)
        .setDescription(description)
        .setTimestamp();

    await interaction.reply({ embeds: [embed], ephemeral: true });
};

module.exports = { sendSuccessMessage, sendErrorMessage };
