const { MessageEmbed } = require('discord.js');

module.exports = {
	name: 'addsubs',
	description: 'Add subscription to user',
	usage: '<prefix>addsubs <@user> [days]',
	examples: ['addsubs @Ritshu#0228 31'],
	aliases: ['addsub'],
	dir: 'Admin',
	cooldown: 1,
	permissions: [],

	run: async (client, message, args) => {
		const embed = new MessageEmbed().setColor('#9BEEFF').setFooter({
			text: 'Powered by GrowZone',
			iconURL: 'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
		});

		if (
			message.member.roles.cache.find((x) => x.name === 'Administrator') ||
			message.member.roles.cache.find((x) => x.name === 'President') ||
			message.member.roles.cache.find((x) => x.name === '🔑')
		) {
			let user = args[0];
			user = getMember(message, args[0]).user;
			let guild = client.guilds.cache.get(client.config.serverID);
			const premiumRole = await guild.roles.fetch(client.config.premiumID);
			if (!user) return;

			let duration = args[1];
			if (isNaN(duration))
				return message.reply({
					embeds: [
						embed
							.setAuthor({ name: 'Add Subscription Status: FAILED', iconURL: user.displayAvatarURL({ dynamic: true }) })
							.setDescription('Please provide a valid duration for the given user!'),
					],
				});

			const member = await guild.members.fetch(user.id);
			if (user && duration) {
				let durationMS = duration * 86400000;
				let durationToDB = Date.now() + durationMS;
				let exist = await client.db.get(`premiumUser.${user.id}`);

				if (exist) {
					let addSubs = durationMS;
					const totalSubDate = await client.db.add(`premiumUser.${user.id}`, addSubs);
					const totalSubDateFormatted = Math.ceil(Object.values(totalSubDate) / 1000);

					message.reply({
						embeds: [
							embed
								.setAuthor({ name: 'Add Subscription Status: SUCCESS', iconURL: user.displayAvatarURL({ dynamic: true }) })
								.setDescription(`Succesfully added \`${duration} Days\` more of premium subscription to **${user.tag}**`)
								.addFields([
									{
										name: 'Total premium duration',
										value: `<t:${totalSubDateFormatted}:R> - <t:${totalSubDateFormatted}>`,
									},
								]),
						],
					});
				} else {
					await client.db.add(`premiumUser.${user.id}`, durationToDB);

					message.reply({
						embeds: [
							embed
								.setAuthor({ name: 'Add Subscription Status: SUCCESS', iconURL: user.displayAvatarURL({ dynamic: true }) })
								.setDescription(`Succesfully added \`${duration} Days\` of premium subscription to **${user.tag}**`),
						],
					});

					member.roles.add(premiumRole);
				}
			}

			function getMember(message, toFind = '') {
				toFind = toFind.toLowerCase();
				let target = message.guild.members.cache.get(toFind);

				if (!target && message.mentions.members) target = message.mentions.members.first();

				if (!target && toFind) {
					target = message.guild.members.cache.find((member) => {
						return member.displayName.toLowerCase().includes(toFind) || member.user.tag.toLowerCase().includes(toFind);
					});
				}

				// invalid user given
				if (!target) return message.reply(`Please provide a valid user to add premium subscription`);

				return target;
			}
		}
	},
};
