const { query } = require('../server/apicall')
const route = require('../server/routes')

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
        console.log(interaction.user)
        const serviceName = interaction.options.getString('serviceName');
        const serviceLink = interaction.options.getString('serviceLink');
        const monthlyFee = interaction.options.getString('monthlyFee');
        const payload = { serviceName, serviceLink, monthlyFee }

        try {

            getToken()
            const response = await query(route.createService, 'POST', null, payload)
            if (response.code == 200) {
                return sendSuccessMessage(interaction, 'Success', response.message)
            }

        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to fetch user data.', ephemeral: true });
        }
    },
};
