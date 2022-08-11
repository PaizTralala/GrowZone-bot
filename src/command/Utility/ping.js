module.exports = {
	name: 'ping',
	description: 'Shows bot latency',
	usage: '<prefix>ping',
	examples: ['ping'],
	aliases: ['pong'],
	dir: 'Utility',
	cooldown: 1,
	permissions: [],

	run: async (client, message, args) => {
		message
			.reply({
				embeds: [
					{
						color: client.color.messagecolor.cyan,
						title: `Pinging....`,
						description: `Calculating ping...`
					}
				]
			})
			.then((messageReply) => {
				const ping = messageReply.createdTimestamp - message.createdTimestamp;
				messageReply.edit({
					embeds: [
						{
							color: client.color.messagecolor.green,
							title: `Pong 🏓`,
							description: `📥 API Latency: \`${Math.round(client.ws.ping)}ms\`\n🤖 Bot Latency: \`${ping}ms\``
						}
					]
				});
			});
	}
};
