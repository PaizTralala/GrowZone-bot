const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
	name: 'removesubs',
	description: 'Remove premium subscription from a user!',
	dir: 'Admin',
	cooldown: 1,
	permissions: ['ADMINISTRATOR'],
	options: [
		{
			name: 'member',
			description: 'Provide a guild member to remove their premium status!',
			type: 6,
			required: true,
		},
	],

	/**
	 *
	 * @param { * } client
	 * @param { CommandInteraction } interaction
	 */
	run: async (client, interaction) => {
		const member = interaction.options.getMember('member');

		const guild = client.guilds.cache.get(client.config.serverID);
		const premiumRole = await guild.roles.fetch(client.config.premiumID);

		const embed = new MessageEmbed().setColor('#9BEEFF').setFooter({
			text: 'Powered by GrowZone',
			iconURL: 'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
		});

		if (!member) return interaction.reply({ content: 'Cannot find that user!', ephemeral: true });
		if (member.user.bot) return interaction.reply({ content: 'Ngapain nyobain ke bot dah, iseng amad 😭😭', ephemeral: true });

		if (interaction.member.roles.cache.find((x) => x.name === '🔑')) {
			if (member) {
				let exist = await client.db.get(`premiumUser.${member.user.id}`);

				if (exist) {
					await client.db.delete(`premiumUser.${member.user.id}`);
					member.roles.remove(premiumRole);

					interaction.reply({
						embeds: [
							embed
								.setAuthor({ name: 'Delete Subscription Status: SUCCESS', iconURL: member.user.displayAvatarURL({ dynamic: true }) })
								.setDescription(`Succesfully deleted **${member.user.tag}** from premium user`),
						],
					});

					// Notifies the user when their premium are forcely removed.
					member.send({
						embeds: [
							embed
								.setAuthor({ name: 'Premium Status: REMOVED (FORCED)', iconURL: member.user.displayAvatarURL({ dynamic: true }) })
								.setDescription(
									'Your premium access has been revoked. If you think this is a mistake please DM (Direct Message) @President / @Administrator.',
								),
						],
					});
				} else {
					interaction.reply({
						embeds: [
							embed
								.setAuthor({ name: 'Delete Subscription Status: FAILED', iconURL: member.user.displayAvatarURL({ dynamic: true }) })
								.setDescription(`**${member.user.tag}** Doesn't have any active subscription!`),
						],
					});

					member.roles.remove(premiumRole);
				}
			}
		}
	},
};
