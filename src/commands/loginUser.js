const { query } = require('../server/apicall');
const route = require('../server/routes');
const { storeTokens } = require('../utility/authHandler');
const { sendErrorMessage, sendSuccessMessage } = require('../utility/messageHandler');

module.exports = {
    name: 'login',
    description: 'Log in to the bot',
    options: [
        { name: 'email', type: 3, description: 'Your email', required: true },
        { name: 'password', type: 3, description: 'Your password', required: true },
    ],
    async execute(interaction) {
        const email = interaction.options.getString('email');
        const password = interaction.options.getString('password');

        try {
            console.log('called')
            const response = await query(route.login, 'POST', null, { email, password });
            console.log(response)
            if (response.code === 200) {
                // Store tokens and expiry time
                const { user, tokens } = response.data;
                console.log(response.data)
                storeTokens(interaction.user.id, tokens.access.token, tokens.refresh.token, tokens.access.expires ,user._id);

                return sendSuccessMessage(interaction, 'Login Successful', 'You are now logged in!');
            } else {
                return sendErrorMessage(interaction, 'Login Failed', response.message || 'Invalid email or password.');
            }
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred during login.', ephemeral: true });
        }
    },
};
