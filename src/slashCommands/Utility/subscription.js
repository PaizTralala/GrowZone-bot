const { MessageEmbed, CommandInteraction } = require('discord.js');

module.exports = {
	name: 'subscription',
	description: 'Shows their premium subscription status!',
	dir: 'Utility',
	cooldown: 1,
	permissions: [],
	options: [
		{
			name: 'member',
			description: 'Provide a guild member to show their premium duration!',
			type: 6,
			required: false,
		},
	],

	/**
	 *
	 * @param {*} client
	 * @param {CommandInteraction} interaction
	 */
	run: async (client, interaction) => {
		const embed = new MessageEmbed().setColor('#9BEEFF').setFooter({
			text: 'Powered by GrowZone',
			iconURL: 'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
		});

		let member = interaction.options.getMember('member');
		if (!member) member = interaction;
		if (member.user.bot) {
			return interaction.reply({ content: 'Itu bot anjir 😭😭', ephemeral: true });
		}

		let premiumLeft = await client.db.get(`premiumUser.${member.user.id}`);

		if (!premiumLeft) {
			return interaction.reply({
				embeds: [
					embed
						.setAuthor({ name: 'Subscription Status: FAILED', iconURL: member.user.displayAvatarURL({ dynamic: true }) })
						.setDescription(`User with tag **${member.user.tag}** doesn't have any active subscription!`),
				],
			});
		}

		let premiumEndsIn = new Date(premiumLeft);
		const premiumEndsInFormatted = Math.ceil(premiumEndsIn / 1000);

		interaction.reply({
			embeds: [
				embed
					.setAuthor({ name: `Subscription information for: ${member.user.tag}`, iconURL: member.user.displayAvatarURL({ dynamic: true }) })
					.setDescription(`Subscription ends <t:${premiumEndsInFormatted}:R> - <t:${premiumEndsInFormatted}>`),
			],
		});
	},
};
