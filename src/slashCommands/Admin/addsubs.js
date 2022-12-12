const { CommandInteraction, MessageEmbed } = require('discord.js');

module.exports = {
  name: 'addsubs',
  description: 'Add premium subscription to a user!',
  dir: 'Admin',
  cooldown: 1,
  categoryEmoji: '<:mimin:1009020303336288287>',
  permissions: ['ADMINISTRATOR'],
  options: [
    {
      name: 'member',
      description: 'Provide a guild member to give them premium status!',
      type: 6,
      required: true,
    },
    {
      name: 'duration',
      description: 'Input a duration (days)',
      type: 3,
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
    const duration = interaction.options.getString('duration');

    const guild = client.guilds.cache.get(client.config.serverID);
    const premiumRole = await guild.roles.fetch(client.config.premiumID);

    const embed = new MessageEmbed().setColor('#9BEEFF').setFooter({
      text: 'Powered by GrowZone',
      iconURL:
        'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
    });

    const extendedPremiumEmbed = new MessageEmbed()
      .setColor('#9BEEFF')
      .setFooter({
        text: 'Powered by GrowZone',
        iconURL:
          'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
      });

    if (!member)
      return interaction.reply({
        content: 'Cannot find that user!',
        ephemeral: true,
      });

    if (member.user.bot)
      return interaction.reply({
        content: 'Ngapain ngasi bot premium 😅😅😅',
        ephemeral: true,
      });

    if (isNaN(duration))
      return interaction.reply({
        content:
          'Kasih hari yang bener dong 😭😭😭, angka aja jangan ada hurufnya (contoh: 31)',
        ephemeral: true,
      });

    if (
      interaction.member.roles.cache.find((x) => x.name === 'Admin')
    ) {
      if (duration > 365) {
        return interaction.reply({
          content: 'Lama amat anj 🐶🐶🐶🐶',
          ephemeral: true,
        });
      }

      if (member && duration) {
        let durationMS = duration * 86400000;
        let durationToDB = Date.now() + durationMS;
        let exist = await client.db.get(`premiumUser.${member.user.id}`);

        if (exist) {
          let addSubs = durationMS;
          await client.db.add(`premiumUser.${member.user.id}`, addSubs);
          await client.db.set(
            `premManager.${member.user.id}`,
            interaction.user.id
          );

          const getLatestUserDate = await client.db.get(
            `premiumUser.${member.user.id}`
          );
          const formattedDate = Math.ceil(getLatestUserDate / 1000);

          interaction.reply({
            embeds: [
              embed
                .setAuthor({
                  name: 'Add Subscription Status: SUCCESS',
                  iconURL: member.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                  `Succesfully added \`${duration} Days\` more of premium subscription to **${member.user.tag}**`
                )
                .addFields([
                  {
                    name: 'Total premium duration',
                    value: `<t:${formattedDate}:R> - <t:${formattedDate}>`,
                  },
                  {
                    name: `Premium Manager`,
                    value: `> *${interaction.user.tag}*`,
                  },
                ]),
            ],
          });

          // Notifies the user when their premium is extended
          member.send({
            embeds: [
              extendedPremiumEmbed
                .setAuthor({
                  name: 'Premium Status: EXTENDED',
                  iconURL: member.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription('Your premium is now extended. Congrats! 🎉')
                .addFields([
                  {
                    name: 'Your total premium duration ends',
                    value: `<t:${formattedDate}:R> - <t:${formattedDate}>`,
                  },
                  {
                    name: `Premium Manager`,
                    value: `> *${interaction.user.tag}*`,
                  },
                ]),
            ],
          });
        } else {
          await client.db.add(`premiumUser.${member.user.id}`, durationToDB);
          await client.db.set(
            `premManager.${member.user.id}`,
            interaction.user.id
          );

          member.roles.add(premiumRole);

          const getNewSubDate = await client.db.get(
            `premiumUser.${member.user.id}`
          );
          const getNewSubDateFormatted = Math.ceil(getNewSubDate / 1000);

          interaction.reply({
            embeds: [
              embed
                .setAuthor({
                  name: 'Add Subscription Status: SUCCESS',
                  iconURL: member.user.displayAvatarURL({ dynamic: true }),
                })
                .setDescription(
                  `Succesfully added \`${duration} Days\` of premium subscription to **${member.user.tag}**`
                )
                .addFields([
                  {
                    name: `Premium Manager`,
                    value: `> *${interaction.user.tag}*`,
                  },
                ]),
            ],
          });

          /*
          // Notifies the user when their premium is activated
          try {
            member.send({
              embeds: [
                extendedPremiumEmbed
                  .setAuthor({
                    name: 'Premium Status: ACTIVE',
                    iconURL: member.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescription('Your premium is now activated. Congrats! 🎉')
                  .addFields([
                    {
                      name: 'Your premium duration ends',
                      value: `<t:${getNewSubDateFormatted}:R> - <t:${getNewSubDateFormatted}>`,
                    },
                    {
                      name: `Premium Manager`,
                      value: `> *${interaction.user.tag}*`,
                    },
                  ]),
              ],
            });
          } catch (err) {
            client.logger.error(err);
          } */
        }
      }
    }
  },
};
