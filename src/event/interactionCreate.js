const { Collection, CommandInteraction } = require('discord.js');

/**
 *
 * @param {*} client
 * @param {CommandInteraction} interaction
 */
module.exports = async (client, interaction) => {
	if (interaction.isCommand() || interaction.isContextMenu()) {
		if (!interaction.guild) {
			return interaction.reply({ content: 'This command can only be run within a guild/server!', ephemeral: true });
		}

		if (!client.slash.has(interaction.commandName)) {
			return interaction.reply({ content: 'Cannot find that command. Might no longer exist!', ephemeral: true });
		}

		const command = client.slash.get(interaction.commandName);

		try {
			if (!cooldowns.has(command.name)) {
				cooldowns.set(command.name, new Collection());
			}

			const now = Date.now();
			const timestamps = cooldowns.get(command.name);
			const cooldownAmount = command.cooldown || 2 * 1000;

			if (timestamps.has(interaction.user.id)) {
				const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;
				if (now < expirationTime) {
					const timeLeft = (expirationTime - now) / 1000;
					return interaction.reply({
						content: `Wait ${timeLeft.toFixed(1)} more second${timeLeft.toFixed(1) < 2 ? '' : 's'} to use **${command.name}**`,
						ephemeral: true
					});
				}
			}

			timestamps.set(interaction.user.id, now);
			setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

			if (command.permissions) {
				if (!interaction.member.permissions.has(command.permissions)) {
					return interaction.reply({
						content: `You're missing permissions : ${command.permissions.map((p) => `**${p}**`).join(', ')}`,
						ephemeral: true
					});
				}
			}

			await command.run(client, interaction);
		} catch (err) {
			client.logger.error(err);
			await interaction.reply({ content: 'An error has occured', ephemeral: true });
		}
	}
};
