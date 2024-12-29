const { removeTokens } = require('../utility/authHandler');
const { sendSuccessMessage } = require('../utility/messageHandler');

module.exports = {
    name: 'logout',
    description: 'Log out of the bot',
    async execute(interaction) {

        await removeTokens(interaction.user.id);
        return sendSuccessMessage(interaction, 'Logged Out', 'You are now logged out.');
    },
};
