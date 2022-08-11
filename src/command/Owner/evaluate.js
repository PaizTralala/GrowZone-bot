module.exports = {
	name: 'evaluate',
	description: 'Evaluate code',
	usage: '<prefix>evaluate [code]',
	examples: ['evaluate (JavaScript codes)'],
	aliases: ['eval'],
	dir: 'Owner',
	cooldown: 1,
	permissions: [],

	run: async (client, message, args) => {
		const owners = client.config.owner.forEach(async (owner) => {
			if (message.author.id !== owner) return;

			try {
				const code = args.join(' ');
				if (!code) return;
				let evaled = eval(code);
				let type = typeof evaled;

				if (typeof evaled !== 'string') evaled = require('util').inspect(evaled, { depth: 0 });
				let output = client.util.clean(evaled);
				output = output.replace(new RegExp(client.config.token, 'gi'), '*');

				if (output.length > 1024) {
					client.logger.log(output);
					message.channel.send({
						embeds: [
							{
								color: client.color.messagecolor.green,
								description: client.util.codeBlock('Output more than 1024 length! i put this on console.log', 'js'),
								fields: [
									{
										name: 'Type',
										value: client.util.codeBlock(type, 'js')
									}
								]
							}
						]
					});
				} else {
					message.channel.send({
						embeds: [
							{
								color: client.color.messagecolor.green,
								description: client.util.codeBlock(output, 'js'),
								fields: [
									{
										name: 'Type',
										value: client.util.codeBlock(type, 'js')
									}
								]
							}
						]
					});
				}
			} catch (e) {
				let error = client.util.clean(e);
				if (error.length > 1024) {
					message.channel.send({
						embeds: [
							{
								color: client.color.messagecolor.red,
								description: 'Too many characters! please check console instead.',
								fields: [
									{
										name: 'Type',
										value: client.util.codeBlock(this.type, 'js')
									}
								]
							}
						]
					});
				} else {
					message.channel.send({
						embeds: [
							{
								color: client.color.messagecolor.green,
								description: client.util.codeBlock(error, 'js'),
								fields: [
									{
										name: 'Type',
										value: client.util.codeBlock(this.type, 'js')
									}
								]
							}
						]
					});
				}
			}
		});
	}
};
