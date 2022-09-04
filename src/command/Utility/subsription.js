const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'subscription',
	description: 'Shows duration of premium subscriptons on Growzone server',
	usage: '<prefix>subscription <@user>',
	examples: ['subscription', 'subscription @Ritshu#0228'],
	aliases: ['subs'],
	dir: 'Utility',
	cooldown: 1,
	permissions: [],

	run: async (client, message, args) => {
		const embed = new MessageEmbed().setColor('#9BEEFF').setFooter({
			text: 'Powered by GrowZone',
			iconURL: 'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
		});

		let user = getMember(message, args.join(' ')).user;
		if (!user) return;

		let premiumLeft = await client.db.get(`premiumUser.${user.id}`);
		if (!premiumLeft)
			return message.reply({
				embeds: [
					embed
						.setAuthor({ name: 'Subscription Status: FAILED', iconURL: user.displayAvatarURL({ dynamic: true }) })
						.setDescription(`User with tag **${user.tag}** doesn't have any active subscription!`),
				],
			});

		let premiumEndsIn = new Date(premiumLeft);
		const premiumEndsInFormatted = Math.ceil(premiumEndsIn / 1000);

		message.reply({
			embeds: [
				embed
					.setAuthor({ name: `Subscription information for: ${user.tag}`, iconURL: user.displayAvatarURL({ dynamic: true }) })
					.setDescription(`Subscription ends <t:${premiumEndsInFormatted}:R> - <t:${premiumEndsInFormatted}>`),
			],
		});

		function getMember(message, toFind = '') {
			toFind = toFind.toLowerCase();

			let target = message.guild.members.cache.get(toFind);

			if (!target && message.mentions.members) target = message.mentions.members.first();

			if (!target && toFind) {
				target = message.guild.members.cache.find((member) => {
					return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
				});
			}

			if (!toFind) target = message.member;
			if (!target) return message.channel.send(`Can't fetch given user`);

			return target;
		}
	},
};