const { MessageEmbed } = require('discord.js');

module.exports = async (client) => {
	client.logger.info(`[!] ${client.user.username} is now started...`);
	client.logger.info(`[!] The bot have ${client.commands.size} commands and ${client.slash.size} (/) commands`);

	// AUTO UPDATE RPC
	setInterval(async function () {
		let premEntries = await client.db.get(`premiumUser`).then((x) => Object.keys(x));
		let premiumUsers = premEntries.length;
		const guildData = client.guilds.cache.get(client.config.serverID);
		let memberCount = client.guilds.cache.reduce((a, g) => a + g.memberCount, 0);

		const Activities = [
			{ type: `WATCHING`, content: `${premiumUsers} Premium Users` },
			{ type: `PLAYING`, content: `With ${memberCount} Users` },
			{ type: `COMPETING`, content: guildData.name },
			{ type: `LISTENING`, content: `${premiumUsers} out of ${memberCount} Users` },
		];
		const index = Math.floor(Math.random() * (Activities.length - 1) + 1);
		client.user.setActivity(Activities[index].content, { type: Activities[index].type });
	}, 60000);

	const embed = new MessageEmbed().setColor('#9BEEFF').setFooter({
		text: 'Powered by GrowZone',
		iconURL: 'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
	});

	// AUTO PREMIUM ROLE
	setInterval(async function () {
		let premiumUser = await client.db.get(`premiumUser`);
		if (!premiumUser || premiumUser === null) return;
		const userID = Object.keys(premiumUser);

		let guild = client.guilds.cache.get(client.config.serverID);
		const premiumRole = await guild.roles.fetch(client.config.premiumID);
		let userInRole = guild.roles.cache.get(client.config.premiumID).members.map((x) => x.user.id);
		let nowDateMS = Date.now();

		// Check if user has prem and expirationTime
		if (userInRole.length > 0) {
			await Promise.all(
				userInRole.map(async (user) => {
					const member = await guild.members.fetch(user);
					let subscription = await client.db.get(`premiumUser.${user}`);
					if (!subscription || subscription === null) {
						member.roles.remove(premiumRole);

						let logsChannel = client.channels.cache.get(client.config.logsID);

						logsChannel.send({
							embeds: [
								embed
									.setAuthor({
										name: 'Premium Status: REMOVED',
										iconURL: member.user.displayAvatarURL({ dynamic: true }),
									})
									.setDescription(`Premium status for **${member.user.tag}** with id \`${member.user.id}\` has been removed.`)
									.addFields([
										{
											name: 'Reason',
											value: "Provided user doesn't have any active subscription!",
										},
									]),
							],
						});
					}
					if (subscription <= nowDateMS) {
						await client.db.delete(`premiumUser.${user}`);
						await client.db.delete(`premManager.${user}`);
						member.roles.remove(premiumRole);
						client.logger.database(`Deleted ${member.user.tag} from premiumUser [Reason: Having expired subscription]`);
						let logsChannel = client.channels.cache.get(client.config.logsID);
						logsChannel.send({
							embeds: [
								embed
									.setAuthor({
										name: 'Premium Status: ENDED',
										iconURL: member.user.displayAvatarURL({ dynamic: true }),
									})
									.setDescription(`Premium status for **${member.user.tag}** with id \`${member.user.id}\` has been removed.`)
									.setFields([
										{
											name: 'Reason',
											value: 'Provided user subscription has ended!',
										},
									]),
							],
						});
						try {
							await client.users.fetch(user).then((user) => {
								user.send({
									embeds: [
										embed
											.setAuthor({
												name: 'Premium Reminder: GrowZone',
												iconURL: client.user.displayAvatarURL({
													dynamic: true,
												}),
											})
											.setDescription(`Hello **${member.user.tag}**. Your premium subscription is ended`)
											.setFields([
												{
													name: 'Message',
													value: `from now on you can't extend premium subscription and you will have to \`re-subscribe\`. thanks for supporting **GrowZone Server**`,
												},
											]),
									],
								});
							});
						} catch (err) {
							client.logger.error(err);
						}
					}
				}),
			);
		}
		if (userID.length > 0) {
			await Promise.all(
				userID.map(async (user) => {
					const member = await guild.members.fetch(user);
					let expiredAt = await client.db.get(`premiumUser.${user}`);
					if (nowDateMS >= expiredAt) {
						await client.db.delete(`premiumUser.${user}`);
						await client.db.delete(`premManager.${user}`);
						member.roles.remove(premiumRole);
						client.logger.database(`Deleted ${member.user.tag} from premiumUser [Reason: Having expired subscription]`);
						let logsChannel = client.channels.cache.get(client.config.logsID);
						logsChannel.send({
							embeds: [
								embed
									.setAuthor({
										name: 'Premium Status: ENDED',
										iconURL: member.user.displayAvatarURL({ dynamic: true }),
									})
									.setDescription(`Premium status for **${member.user.tag}** with id \`${member.user.id}\` has been removed.`)
									.setFields([
										{
											name: 'Reason',
											value: 'Provided user subscription has ended!',
										},
									]),
							],
						});
						try {
							await client.users.fetch(user).then((user) => {
								user.send({
									embeds: [
										embed
											.setAuthor({
												name: 'Premium Reminder: GrowZone',
												iconURL: client.user.displayAvatarURL({
													dynamic: true,
												}),
											})
											.setDescription(`Hello **${member.user.tag}**. Your premium subscription is ended`)
											.setFields([
												{
													name: 'Message',
													value: `from now on you can't extend premium subscription and you will have to \`re-subscribe\`. thanks for supporting **GrowZone Server**`,
												},
											]),
									],
								});
							});
						} catch (err) {
							client.logger.error(err);
						}
					}

					// Reminder if user's subscription almost ended
					let oneDay = 60000 * 60 * 24;
					let oneDayBeforeEnd = expiredAt - oneDay;
					let extraFiveSecond = oneDayBeforeEnd + 5000;
					const premiumEndsInFormatted = Math.ceil(expiredAt / 1000);

					if (nowDateMS.between(oneDayBeforeEnd, extraFiveSecond)) {
						let fetchGuild = client.guilds.cache.get(client.config.serverID);
						let getLogsChannel = fetchGuild.channels.cache.get(client.config.logsID);

						if (getLogsChannel.type === 'GUILD_TEXT') {
							getLogsChannel.send({
								embeds: [
									embed
										.setAuthor({
											name: 'Premium Reminder: SENT',
											iconURL: member.user.displayAvatarURL({ dynamic: true }),
										})
										.setDescription(`Premium reminder sent to **${member.user.tag}** with id \`${member.user.id}\`.`)
										.setFields([
											{
												name: `${member.user.username}'s subscription ends`,
												value: `<t:${premiumEndsInFormatted}:R> - <t:${premiumEndsInFormatted}>`,
											},
										]),
								],
							});
						}

						try {
							await client.users.fetch(user).then((user) => {
								user.send({
									embeds: [
										embed
											.setAuthor({
												name: 'Premium Reminder: GrowZone',
												iconURL: client.user.displayAvatarURL({
													dynamic: true,
												}),
											})
											.setDescription(`Hello **${member.user.tag}**. Your premium subscription is about to end`)
											.setFields([
												{
													name: 'Your premium ends',
													value: `<t:${premiumEndsInFormatted}:R> - <t:${premiumEndsInFormatted}>`,
												},
											]),
									],
								});
							});
						} catch (err) {
							client.logger.error(err);
						}
					}
				}),
			);
		}
	}, 5000);
};

Number.prototype.between = function (a, b) {
	var min = Math.min.apply(Math, [a, b]),
		max = Math.max.apply(Math, [a, b]);
	return this > min && this < max;
};
