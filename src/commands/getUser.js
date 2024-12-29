const { query } = require('../server/apicall')
const route = require('../server/routes')
const utility = require('../utility/authHandler')
const { sendSuccessMessage, sendErrorMessage } = require('../utility/messageHandler')

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
            const headers = { Authorization: `Bearer ${tokenData?.accessToken}` };
            const response = await query(route.getUser, 'POST', headers, payload)
            console.log("🚀 ~ execute ~ response:", response)
            const { data } = response || {}
            if (response.code == 200 && Object.keys(data).length != 0) {
                const servicesList = data.services
                    ?.map(
                        (service, index) =>
                            `**${index + 1}. ${service.serviceName}**\nLink: ${service.serviceLink}\nFee: ${service.monthlyFee}\n`
                    )
                    .join('\n');

                const message = `**User Data**\nUsername: ${data.username}\nEmail: ${data.email}\n\n**Services:**\n${servicesList}`;

                return sendSuccessMessage(interaction, 'Success', message)
            }
            return sendErrorMessage(interaction, 'Error',  'User not found');

        } catch (error) {
            console.error(error);
            return sendErrorMessage(interaction, 'Error', error);
        }
    },
};
