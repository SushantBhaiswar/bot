const { query } = require('../server/apicall')
const route = require('../server/routes')
const utility = require('../utility/authHandler')
const { sendSuccessMessage } = require('../utility/messageHandler')
module.exports = {
    name: 'ppcreateservice',
    description: 'Create a user',
    options: [
        {
            name: 'servicename',
            type: 3,
            description: 'Name of the service to create',
            required: true,
        },
        {
            name: 'servicelink',
            type: 3,
            description: 'Link to the service',
            required: true,
        },
        {
            name: 'monthlyfee',
            type: 10,
            description: 'Monthly fee for the service in dollars',
            required: true,
        },
    ],
    async execute(interaction) {
        const serviceName = interaction.options.getString('servicename');
        const serviceLink = interaction.options.getString('servicelink');
        const monthlyFee = interaction.options.getNumber('monthlyfee');
        const payload = { serviceName, serviceLink, monthlyFee }

        try {

            const tokenData = await utility.getToken(interaction)
            const headers = { Authorization: `Bearer ${tokenData.accessToken}` };
            const response = await query(route.createService, 'POST', headers, payload)
            if (response.code == 200) {
                return sendSuccessMessage(interaction, 'Success', response.message)
            }
            await interaction.reply({ content: 'Failed to fetch user data.', ephemeral: true });


        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to fetch user data.', ephemeral: true });
        }
    },
};
