const { query } = require('../server/apicall')
const route = require('../server/routes')
const utility = require('../utility/authHandler')
const { sendSuccessMessage } = require('../utility/messageHandler')

module.exports = {
    name: 'ppgetuser',
    description: 'Get user data and associated services',
    options: [
        { name: 'username', type: 3, description: 'Username to fetch data for', required: true },
    ],
    async execute(interaction) {
        const username = interaction.options.getString('username');
        const payload = { userName: username }

        try {
            const tokenData = await utility.getToken(interaction)
            const headers = { Authorization: `Bearer ${tokenData.accessToken}` };
            const response = await query(route.getUser, 'POST', headers, payload)
            const { data } = response || {}
            if (response.code == 200) {
                const servicesList = data.services
                    .map(
                        (service, index) =>
                            `**${index + 1}. ${service.serviceName}**\nLink: ${service.serviceLink}\nFee: ${service.monthlyFee}\n`
                    )
                    .join('\n');

                const message = `**User Data**\nUsername: ${data.username}\nEmail: ${data.email}\n\n**Services:**\n${servicesList}`;
                console.log("🚀 ~ execute ~ servicesList:", servicesList)

                return sendSuccessMessage(interaction, 'Success', message)
            }
            return sendErrorMessage(interaction, 'Error', 'Failed to fetch user data.');

        } catch (error) {
            console.error(error);
            return sendErrorMessage(interaction, 'Error', error);
        }
    },
};
