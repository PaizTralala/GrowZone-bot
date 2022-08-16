const { MessageEmbed, CommandInteraction } = require('discord.js');

module.exports = {
  name: 'leaderboard',
  description: 'Shows a user that have the longest subscription time!',
  dir: 'Utility',
  categoryEmoji: '<:util:1009019849663582351>',
  cooldown: 1,
  permissions: [],

  /**
   *
   * @param {*} client
   * @param {CommandInteraction} interaction
   */
  run: async (client, interaction) => {
    const getData = await client.db.get('premiumUser');
    const keysSorted = Object.keys(getData).sort(function (a, b) {
      return getData[b] - getData[a];
    });

    let arr = [];
    await Promise.all(
      keysSorted.map(async (x, i) => {
        const getUserData = await client.db.get(`premiumUser.${x}`);
        const getMember = await client.users.fetch(x);

        arr.push(
          `\`${i + 1}\` - **${getMember.tag}** - <t:${Math.ceil(
            getUserData / 1000
          )}:R>`
        );
      })
    );

    if (arr.length === 0) {
      arr.push(`There are currently no user that have a premium!`);
    }

    const embed = new MessageEmbed()
      .setAuthor({
        name: 'Top 10 Leaderboard',
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setDescription(
        [
          'This leaderboard are based from a user that have the longest subscription time!',
          '',
          arr.slice(0, 10).join('\n'),
        ].join('\n')
      )
      .setColor('#9BEEFF')
      .setFooter({
        text: 'Powered by GrowZone',
        iconURL:
          'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
      });

    interaction.reply({ embeds: [embed] });
  },
};
