module.exports = {
	name: 'example',
	description: 'Very simple example of a command to understand how to use this template',
	usage: '<prefix>example [ping]',
	examples: ['example', 'example ping:true'],
	dir: 'slashCommand',
	cooldown: 1,
	permissions: [],
	options: [
		{
			name: 'ping',
			description: "Get the bot's latency",
			type: 3,
			required: false,
			choices: [
				{ name: 'yes', value: 'true' },
				{ name: 'no', value: 'false' },
			],
		},
	],

	run: async (client, interaction) => {
		if (interaction.options.getString('ping') === 'true') {
			interaction.reply({ content: `Hello world !\n> Bot's latency : **${Math.round(client.ws.ping)}ms**` });
		} else {
			interaction.reply({ content: 'Hello world !' });
		}
	},
};
