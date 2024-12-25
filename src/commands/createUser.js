const config = require("../config/config")
const { query } = require('../server/apicall')
const route = require('../server/routes')
const emailValidator = require("email-validator");
const { sendErrorMessage, sendSuccessMessage } = require('../utility/messageHandler')
const utils = require('../utility/helper')
module.exports = {
    name: 'createuser',
    description: 'Create a user in the system',
    options: [
        {
            name: 'username',
            type: 3,
            description: 'Username for the new user',
            required: true,
        },
        {
            name: 'email',
            type: 3,
            description: 'Email for the new user',
            required: true,
        },
        {
            name: 'password',
            type: 3,
            description: 'Password for the new user',
            required: true,
        },
    ],
    async execute(interaction) {
        const username = interaction.options.getString('username');
        const email = interaction.options.getString('email');
        const password = interaction.options.getString('password');
        const payload = { userName: username, email, password }
        try {

            // Validate email format
            if (!emailValidator.validate(email)) {
                return sendErrorMessage(interaction, 'Error', utils.geterrorMessagess('user.invalidEmail'));
            }

            // Validate password length
            if (password.length < 8) {
                return sendErrorMessage(interaction, 'Error', utils.geterrorMessagess('user.invalidPassword'));

            }

            const response = await query(route.createUser, 'POST', null, payload)
            if (response.code == 200) {
                return sendSuccessMessage(interaction , 'Success', response.message)
            }




        } catch (error) {
            await interaction.reply({ content: 'Failed to create user.', ephemeral: true });
            console.error(error);
        }
    },
};
