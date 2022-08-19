const { MessageEmbed } = require('discord.js');

module.exports = async (client) => {
  client.logger.info(`[!] ${client.user.username} is now started...`);
  client.logger.info(
    `[!] The bot have ${client.commands.size} commands and ${client.slash.size} (/) commands`
  );

  // Deploying slash command
  const getCommands = client.slash.map((x) => x);

  try {
    await client.application.commands.set(getCommands);
    client.logger.info(`[!] Loaded ${getCommands.length} (/) commands!`);
  } catch (err) {
    client.logger.error(err);
  }

  // Auto Update RPC
  setInterval(async () => {
    const getPremiumEntries = await client.db
      .get('premiumUser')
      .then((x) => Object.keys(x));
    const getPremiumUsers = getPremiumEntries.length;

    const getGuildData = client.guilds.cache.get(client.config.serverID);
    const getMemberCount = client.guilds.cache.reduce(
      (a, g) => a + g.memberCount,
      0
    );

    const activitiesArr = [
      {
        type: 'WATCHING',
        content: `${getPremiumUsers} Premium Users`,
      },
      { type: `PLAYING`, content: `With ${getMemberCount} Users` },
      { type: `COMPETING`, content: getGuildData.name },
      {
        type: `LISTENING`,
        content: `${getPremiumUsers} out of ${getMemberCount} Users`,
      },
    ];

    const randomIndex = Math.floor(
      Math.random() * (activitiesArr.length - 1) + 1
    );

    client.user.setActivity(activitiesArr[randomIndex].content, {
      type: activitiesArr[randomIndex].type,
    });
  }, 60000);

  let embed = new MessageEmbed().setColor('#9BEEFF').setFooter({
    text: 'Powered by GrowZone',
    iconURL:
      'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
  });

  // Automation for "Premium" role
  setInterval(async () => {
    let premiumUser = await client.db.get('premiumUser');
    if (!premiumUser || premiumUser === null) return;

    const userID = Object.keys(premiumUser);

    const getGuild = client.guilds.cache.get(client.config.serverID);
    const getPremiumRole = await getGuild.roles.fetch(client.config.premiumID);

    const userInPremiumRole = getGuild.roles.cache
      .get(client.config.premiumID)
      .members.map((x) => x.user.id);

    let nowDateMS = Date.now();

    // Check if user has premium and expirationTime
    if (userInPremiumRole.length > 0) {
      await Promise.all(
        userInPremiumRole.map(async (user) => {
          const member = await getGuild.members.fetch(user);
          const logChannel = client.channels.cache.get(client.config.logsID);
          if (!logChannel) {
            throw new Error(
              `There are no channel found. Maybe you forgot to change things in config.js file?`
            );
          }

          const userSubscription = await client.db.get(`premiumUser.${user}`);

          if (!userSubscription || userSubscription === null) {
            try {
              member.roles.remove(getPremiumRole);

              logChannel.send({
                embeds: [
                  embed
                    .setAuthor({
                      name: 'Premium Status: INVALID',
                      iconURL: member.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setDescription(
                      `Premium ROLE has been removed from **${member.user.tag}** with id \`${member.user.id}\.`
                    )
                    .addFields([
                      {
                        name: 'Reason',
                        value:
                          "Provided user doesn't have any active/valid subscription!",
                      },
                    ]),
                ],
              });
            } catch (err) {
              client.logger.error(err);
            }
          }

          if (userSubscription <= nowDateMS) {
            // Remove the premium User from the database
            await client.db.delete(`premiumUser.${user}`);
            // Remove the premium Manager from the database too.
            await client.db.delete(`premManager.${user}`);

            member.roles.remove(getPremiumRole);
            client.logger.database(
              `${member.user.tag} has been Removed from the database. [Reason: Having expired subscription]`
            );

            logChannel.send({
              embeds: [
                embed
                  .setAuthor({
                    name: 'Premium Status: ENDED',
                    iconURL: member.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescription(
                    `Premium status for **${member.user.tag}** with id \`${member.user.id}\` has been removed.`
                  )
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
                      .setDescription(
                        `Hello **${member.user.tag}**. Your premium subscription is ended`
                      )
                      .setFields([
                        {
                          name: 'Message',
                          value: `From now on you can't extend premium subscription and you will have to \`re-subscribe\`. Thanks for supporting **GrowZone Server**`,
                        },
                      ]),
                  ],
                });
              });
            } catch (err) {
              client.logger.error(err);
            }
          }
        })
      );
    }

    if (userID.length > 0) {
      await Promise.all(
        userID.map(async (user) => {
          const member = await getGuild.members.fetch(user);
          const logChannel = client.channels.cache.get(client.config.logsID);
          if (!logChannel) {
            throw new Error(
              `There are no channel found. Maybe you forgot to change things in config.js file?`
            );
          }

          const premiumUserExpDate = await client.db.get(`premiumUser.${user}`);

          if (
            !member.roles.cache.find((x) => x.id === client.config.premiumID)
          ) {
            try {
              member.roles.add(getPremiumRole);

              logChannel.send({
                embeds: [
                  embed
                    .setAuthor({
                      name: 'Premium Status: VALID',
                      iconURL: member.user.displayAvatarURL({ dynamic: true }),
                    })
                    .setDescription(
                      `Premium ROLE has been added to **${member.user.tag}** with id \`${member.user.id}\`.`
                    )
                    .addFields([
                      {
                        name: 'Reason',
                        value:
                          "Provided user have active subscription but the premium role didn't added yet!",
                      },
                    ]),
                ],
              });
            } catch (err) {
              client.logger.error(err);
            }
          }

          if (nowDateMS >= premiumUserExpDate) {
            // Remove the premium User from the database
            await client.db.delete(`premiumUser.${user}`);
            // Remove the premium Manager from the database too.
            await client.db.delete(`premManager.${user}`);

            member.roles.remove(getPremiumRole);
            client.logger.database(
              `${member.user.tag} has been removed from the database [Reason: Having expired subscription]`
            );

            logChannel.send({
              embeds: [
                embed
                  .setAuthor({
                    name: 'Premium Status: ENDED',
                    iconURL: member.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescription(
                    `Premium status for **${member.user.tag}** with id \`${member.user.id}\` has been removed.`
                  )
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
                      .setDescription(
                        `Hello **${member.user.tag}**. Your premium subscription is ended`
                      )
                      .setFields([
                        {
                          name: 'Message',
                          value: `From now on you can't extend premium subscription and you will have to \`re-subscribe\`. Thanks for supporting **GrowZone Server**`,
                        },
                      ]),
                  ],
                });
              });
            } catch (err) {
              client.logger.error(err);
            }
          }

          // Send a reminder if user's subscription ALMOST ended
          const oneDay = 60000 * 60 * 24;
          const oneDayBeforeEnd = premiumUserExpDate - oneDay;
          const extraFiveSeconds = oneDayBeforeEnd + 5000;

          const premiumEndsInFormatted = Math.ceil(premiumUserExpDate / 1000);

          if (nowDateMS.between(oneDayBeforeEnd, extraFiveSeconds)) {
            logChannel.send({
              embeds: [
                embed
                  .setAuthor({
                    name: 'Premium Reminder: SENT',
                    iconURL: member.user.displayAvatarURL({ dynamic: true }),
                  })
                  .setDescription(
                    `Premium reminder sent to **${member.user.tag}** with id \`${member.user.id}\`.`
                  )
                  .setFields([
                    {
                      name: `${member.user.username}'s subscription ends`,
                      value: `<t:${premiumEndsInFormatted}:R> - <t:${premiumEndsInFormatted}>`,
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
                      .setDescription(
                        `Hello **${member.user.tag}**. Your premium subscription is about to end`
                      )
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
        })
      );
    }
  }, 5000);
};

Number.prototype.between = (a, b) => {
  const min = Math.min.apply(Math, [a, b]);
  const max = Math.max.apply(Math, [a, b]);

  return this > min && this < max;
};
