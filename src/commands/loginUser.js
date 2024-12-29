const { query } = require('../server/apicall');
const route = require('../server/routes');
const { storeTokens } = require('../utility/authHandler');
const emailValidator = require("email-validator");
const { sendErrorMessage, sendSuccessMessage } = require('../utility/messageHandler');
const utils = require('../../src/utility/helper')
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
            // Validate email format
            if (!emailValidator.validate(email)) {
                return sendErrorMessage(interaction, 'Error', utils.geterrorMessagess('user.invalidEmail'));
            }

            // Validate password length
            if (password.length < 8) {
                return sendErrorMessage(interaction, 'Error', utils.geterrorMessagess('user.invalidPassword'));

            }
            const response = await query(route.login, 'POST', null, { email, password });
            console.log("🚀 ~ execute ~ response:", response)
            if (response.code === 200) {
                // Store tokens and expiry time
                const { user, tokens } = response.data;
                console.log(tokens)
                await storeTokens(interaction.user.id, tokens.access.token, tokens.refresh.token, tokens.access.expires, user._id);
                console.log('token saved')
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
