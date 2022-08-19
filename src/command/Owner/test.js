const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Message,
} = require('discord.js');

module.exports = {
  name: 'test',
  description: 'test code',
  usage: '<prefix>test [code]',
  aliases: ['te'],
  dir: 'Owner',
  cooldown: 1,
  permissions: [],

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    client.config.owner.forEach(async (owner) => {
      let arr = [
        'anjing',
        'kucing',
        'kudanil',
        'kerbau',
        'kambing',
        'sapi',
        'kuda',
        'semut',
        'kecoa',
        'lipan',
        'kaki seribu',
        'ular',
        'bison',
        'unta',
        'marmut',
        'kelinci',
        'jangkrik',
        'anjing',
        'kucing',
        'kudanil',
        'kerbau',
        'kambing',
        'sapi',
        'kuda',
        'semut',
        'kecoa',
        'lipan',
        'kaki seribu',
        'ular',
        'bison',
        'unta',
        'marmut',
        'kelinci',
        'jangkrik',
      ];

      const buttonNext = new MessageButton()
        .setCustomId('next-page')
        // .setLabel('Next')
        .setEmoji('1010216829916033134')
        .setStyle('PRIMARY');
      const deleteMessage = new MessageButton()
        .setCustomId('delete-page')
        .setEmoji('982229004763410492')
        .setStyle('DANGER');
      const buttonPrevious = new MessageButton()
        .setCustomId('previous-page')
        // .setLabel('Previous')
        .setEmoji('1010216904457211944')
        .setStyle('PRIMARY');

      /**
       *
       * @param {Array} array
       * @param {Number} size
       */
      const chunkArrayToGroups = (array = [], size = 10) => {
        let result = [];
        let position = 0;

        while (position < array.length) {
          result.push(array.slice(position, position + size));
          position += size;
        }

        return result;
      };

      const groupedArr = chunkArrayToGroups(arr);
      const fitOnOnePage = arr.length <= 10;

      let currentPage = 0;

      const embed = new MessageEmbed()
        .setAuthor({
          name: 'Premium List',
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(groupedArr[0].join('\n'))
        .setFooter({ text: `Page ${currentPage + 1}/${groupedArr.length}` });

      const row = new MessageActionRow().addComponents([
        buttonPrevious.setDisabled(true),
        deleteMessage,
        buttonNext,
      ]);

      const msg = await message.reply({
        embeds: [embed],
        components: fitOnOnePage ? [] : [row],
      });

      if (fitOnOnePage) return;

      const filter = (interaction) => {
        if (interaction.user.id !== message.author.id) {
          interaction.reply({
            content: 'This button is not for you!',
            ephemeral: true,
          });
          return false;
        } else {
          return true;
        }
      };

      const collector = msg.createMessageComponentCollector({
        filter,
      });

      collector.on('collect', async (interaction) => {
        if (interaction.customId === 'delete-page') {
          return await msg.delete();
        }

        interaction.customId === 'previous-page'
          ? (currentPage -= 1)
          : (currentPage += 1);

        const boolRow = new MessageActionRow().addComponents(
          ...(currentPage
            ? [buttonPrevious.setDisabled(false)]
            : [buttonPrevious.setDisabled(true)]),
          deleteMessage,
          ...(groupedArr[currentPage + 1]
            ? [buttonNext.setDisabled(false)]
            : [buttonNext.setDisabled(true)])
        );

        interaction.update({
          embeds: [
            embed.setDescription(groupedArr[currentPage].join('\n')).setFooter({
              text: `Page ${currentPage + 1}/${groupedArr.length}`,
            }),
          ],
          components: [boolRow],
        });
      });

      collector.on('end', () => {
        const disabled = new MessageActionRow().addComponents(
          buttonPrevious.setDisabled(true),
          buttonNext.setDisabled(true)
        );

        // If the initial msg does not exist return nothing.
        if (!msg.deletable) return;

        msg.edit({ embeds: [embed], components: [disabled] });
      });
    });
  },
};
