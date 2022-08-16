const {
  CommandInteraction,
  MessageActionRow,
  MessageSelectMenu,
  MessageEmbed,
} = require('discord.js');

module.exports = {
  name: 'help',
  description: 'Display some information about this bot.',
  dir: 'Utility',
  categoryEmoji: '<:util:1009019849663582351>',
  cooldown: 1,
  permissions: [],

  /**
   *
   * @param { * } client
   * @param { CommandInteraction } interaction
   */
  run: async (client, interaction) => {
    // * This will not filter any sensitive category within the slash command dir!
    const getCategory = client.util.removeDupedLabel(
      client.slash.map((cmd) => ({
        label: cmd.dir,
        value: cmd.dir.toLowerCase(),
        description: `Shows you ${cmd.dir} category commands!`,
        emoji: cmd.categoryEmoji,
      }))
    );

    const selectMenu = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setCustomId('help-menu')
        .addOptions(getCategory)
        .setPlaceholder('Choose a category')
    );

    const mainMenuEmbed = new MessageEmbed()
      .setTitle(`${client.user.username}'s Help Center!`)
      .setColor('#9BEEFF')
      .setDescription(
        ['An official GrowZone bot that mainly handles the premium user!'].join(
          '\n'
        )
      );

    const msg = await interaction.reply({
      embeds: [mainMenuEmbed],
      components: [selectMenu],
      fetchReply: true,
    });

    const filter = async (interaction) => interaction.customId === 'help-menu';
    const collector = interaction.channel.createMessageComponentCollector({
      filter,
      time: 12000,
      componentType: 'SELECT_MENU',
    });

    collector.on('collect', async (interaction) => {
      await interaction.deferReply({ ephemeral: true });

      const commandNameList = client.slash
        .filter(
          (cmd) => cmd.dir.toLowerCase() === interaction.values[0].toLowerCase()
        )
        .map(
          (cmd) =>
            `${cmd.name}\n<:anotha_curve:965498554728742932> ${cmd.description}`
        );

      const collectorEmbed = new MessageEmbed()
        .setTitle(
          `${client.util.capitalise(
            interaction.values[0]
          )} Category Command Lists!`
        )
        .setColor('#9BEEFF')
        .setDescription(commandNameList.join('\n'));

      collector.resetTimer({ time: 15000, idle: 15000 });

      interaction.followUp({ embeds: [collectorEmbed] });
    });

    collector.on('end', () => {
      const disabledMenu = new MessageActionRow().addComponents(
        selectMenu.components[0]
          .setDisabled(true)
          .setPlaceholder('This select menu has expired!')
      );

      msg.edit({ embeds: [mainMenuEmbed], components: [disabledMenu] });
    });
  },
};
