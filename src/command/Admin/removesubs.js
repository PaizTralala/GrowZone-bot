const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'removesubs',
	description: 'Removes user subscription',
	usage: '<prefix>removesubs <@user>',
	examples: ['removesubs @Ritshu#0228'],
	aliases: ['removesub'],
	dir: 'Admin',
	cooldown: 1,
	permissions: [],

	run: async (client, message, args) => {
		const embed = new MessageEmbed().setColor('#9BEEFF').setFooter({
			text: 'Powered by GrowZone',
			iconURL: 'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
		});

		if (message.member.roles.cache.find((x) => x.name === '🔑')) {
			let user = getMember(message, args.join(' ')).user;

			let guild = client.guilds.cache.get(client.config.serverID);
			const premiumRole = await guild.roles.fetch(client.config.premiumID);
			if (!user) return;

			const member = await guild.members.fetch(user.id);
			if (user) {
				let exist = await client.db.get(`premiumUser.${user.id}`);
				if (exist) {
					await client.db.delete(`premiumUser.${user.id}`);
					member.roles.remove(premiumRole);

					message.reply({
						embeds: [
							embed
								.setAuthor({ name: 'Delete Subscription Status: SUCCESS', iconURL: user.displayAvatarURL({ dynamic: true }) })
								.setDescription(`Succesfully deleted **${user.tag}** from premium user`),
						],
					});

					// Notifies the user when their premium are forcely removed.
					// TODO: MAKE A MODAL TO APPEAL?
					user.send({
						embeds: [
							embed
								.setAuthor({ name: 'Premium Status: REMOVED (FORCED)', iconURL: user.displayAvatarURL({ dynamic: true }) })
								.setDescription(
									'Your premium access has been removed. If you think this is a mistake please DM (Direct Message) @President / @Administrator.',
								),
						],
					});
				} else {
					message.reply({
						embeds: [
							embed
								.setAuthor({ name: 'Delete Subscription Status: FAILED', iconURL: user.displayAvatarURL({ dynamic: true }) })
								.setDescription(`**${user.tag}** Doesn't have any active subscription!`),
						],
					});

					member.roles.remove(premiumRole);
				}
			}

			function getMember(message, toFind = '') {
				toFind = toFind.toLowerCase();

				let target = message.guild.members.cache.get(toFind);

				if (!target && message.mentions.members) target = message.mentions.members.first();

				if (!target && toFind) {
					target = message.guild.members.cache.find((x) => {
						return x.displayName.toLowerCase().includes(toFind) || x.user.tag.toLowerCase().includes(toFind);
					});
				}

				if (!toFind) target = message.member;

				if (!target)
					return message.reply({
						embeds: [
							embed
								.setAuthor({ name: 'Add Subscription Status: FAILED', iconURL: message.author.displayAvatarURL({ dynamic: true }) })
								.setDescription('Please provide a valid user to add premium subscription!'),
						],
					});

				return target;
			}
		}
	},
};
