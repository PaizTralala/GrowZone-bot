const {
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  Message,
} = require('discord.js');

module.exports = {
  name: 'premiumlist',
  description:
    'Shows all user who have premium subscription and their manager!',
  usage: '<prefix>premiumlist',
  examples: ['premiumlist'],
  aliases: ['list', 'premlist'],
  dir: 'Admin',
  cooldown: 1,
  permissions: [],

  /**
   *
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   * @returns
   */
  run: async (client, message, args) => {
    if (message.member.roles.cache.find((x) => x.name === 'Admin')) {
      const getData = await client.db.get('premiumUser');
      const keysSorted = Object.keys(getData).sort(function (a, b) {
        return getData[b] - getData[a];
      });

      let arr = [];
      await Promise.all(
        keysSorted.map(async (x, i) => {
          const getUserData = await client.db.get(`premiumUser.${x}`);
          const getManager = await client.db.get(`premManager.${x}`);
          const getMember = await client.users.fetch(x);

          const discordTimeStamp = `<t:${Math.ceil(getUserData / 1000)}:R>`;

          arr.push(
            `\`[${i + 1}]\` - **${
              getMember.tag
            }** - ${discordTimeStamp} -> \`Managed by:\` ${
              getManager ? `<@${getManager}>` : 'Unknown!'
            }`
          );
        })
      );

      if (arr.length === 0) {
        arr.push(`There are currently no user that have a premium!`);
      }

      const buttonNext = new MessageButton()
        .setCustomId('next-page')
        .setEmoji('1010216829916033134')
        .setStyle('PRIMARY');
      const deleteMessage = new MessageButton()
        .setCustomId('delete-page')
        .setEmoji('982229004763410492')
        .setStyle('DANGER');
      const buttonPrevious = new MessageButton()
        .setCustomId('previous-page')
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
        .addFields([
          {
            name: 'Format',
            value: '`[position] - User - Duration - Manager`',
          },
        ])
        .setDescription(groupedArr[0].join('\n'))
        .setColor('#9BEEFF')
        .setFooter({
          text: `Page ${currentPage + 1}/${groupedArr.length}`,
          iconURL: message.guild.iconURL({ dynamic: true }),
        });

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
    }
  },
};
