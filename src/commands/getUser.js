module.exports = {
    name: 'ppgetuser',
    description: 'Get user data and associated services',
    options: [
        { name: 'username', type: 3, description: 'Username to fetch data for', required: true },
    ],
    async execute(interaction) {
        const username = interaction.options.getString('username');

        try {
            const userData = {
                userID: '12345',
                username: username,
                email: 'example@example.com',
                services: [
                    { serviceName: 'YouTube', serviceLink: 'https://youtube.com', monthlyFee: '$3.00' },
                    { serviceName: 'Netflix', serviceLink: 'https://netflix.com', monthlyFee: '$8.99' },
                ],
            };

            const servicesList = userData.services
                .map(
                    (service, index) =>
                        `**${index + 1}. ${service.serviceName}**\nLink: ${service.serviceLink}\nFee: ${service.monthlyFee}\n`
                )
                .join('\n');

            const response = `**User Data**\nUsername: ${userData.username}\nEmail: ${userData.email}\n\n**Services:**\n${servicesList}`;
            await interaction.reply(response);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Failed to fetch user data.', ephemeral: true });
        }
    },
};
