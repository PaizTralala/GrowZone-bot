module.exports = {
	name: 'subscription',
	description: 'Manage user subscription',
	usage: '<prefix>addsubs <@user> [duration]',
	examples: ['addsubs @Ritshu#0228 31'],
	dir: 'Admin',
	cooldown: 1,
	permissions: [],
	options: [
		{
			name: 'add',
			description: 'Add subcription to user',
			type: 6,
			required: true,
			choices: [
				{ name: 'Duration', type: 4 },
			],
		},
		{
			name: 'delete',
			description: 'Delete user subscription',
			type: 6,
			required: true,
			choices: [
				{ name: '', type: 4 },
			],
		}
	],

	run: async (client, interaction) => {
		if (interaction.options.getString('ping') === 'true') {
			interaction.reply({ content: `Hello world !\n> Bot's latency : **${Math.round(client.ws.ping)}ms**` });
		} else {
			interaction.reply({ content: 'Hello world !' });
		}
	},
};
