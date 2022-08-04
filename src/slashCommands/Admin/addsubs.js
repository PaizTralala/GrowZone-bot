module.exports = {
	name: 'addsubs',
	description: 'Add subscription to user',
	usage: '<prefix>addsubs <@user> [duration]',
	examples: ['addsubs @Ritshu#0228 31'],
	dir: 'Admin',
	cooldown: 1,
	permissions: ['Administrator'],
	options: [
		{
			name: 'User',
			description: 'User you want to add subscription',
			type: 6,
			required: true,
		},
		{
			name: 'Duration',
			description: 'Duration you want to add',
			type: 6,
			required: true,
		}
	],

	run: async (client, interaction) => {
		console.log(interaction);
		if (interaction.options.getUser('User') === 'true') {
			interaction.reply({ content: `Hello world !\n> Bot's latency : **${Math.round(client.ws.ping)}ms**` });
		} else {
			interaction.reply({ content: 'Hello world !' });
		}
	},
};
