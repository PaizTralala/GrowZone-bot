const { prefix, serverId, premiumId } = require("../../config");

module.exports = async (client) => {
    client.logger.info(`[!] ${client.user.username} is now started...`);
    client.logger.info(`[!] The bot have ${client.commands.size} commands and ${client.slash.size} (/) commands`);
    client.user.setActivity(`14/15`, { type: 'PLAYING' });


    setInterval(async function () {
        // AUTO PREMIUM ROLE
        let premiumUser = await client.db.get(`premiumUser`);
        if (!premiumUser || premiumUser === null) return;
        const expirationTime = Object.values(premiumUser); // return ms date (arr)
        const userID = Object.keys(premiumUser); // return userID prem user (arr)
        const premEntries = Object.entries(premiumUser); // return entries in array

        let guild = client.guilds.cache.get(client.config.serverID);
        const premiumRole = await guild.roles.fetch(client.config.premiumID);
        let userInRole = guild.roles.cache.get(client.config.premiumID).members.map(x => x.user.id);
        let nowDateMS = Date.now();
        // Check if user has prem and expirationTime

        if (userInRole.length > 0) {
            await Promise.all(
                userInRole.map(
                    async (user) => {
                        const member = await guild.members.fetch(user);
                        let subscription = await client.db.get(`premiumUser.${user}`);
                        if (!subscription || subscription === null) {
                            member.roles.remove(premiumRole);
                            let logsChannel = client.channels.cache.get(client.config.logsID);
                            logsChannel.send({
                                embeds: [{
                                    title: `Premium Role Removal`,
                                    description: `Removed premium role from **${member.user.tag}** \`[Reason: user doesn't have active subscription]\``,
                                    color: `#FF9300`,
                                    footer: {
                                        text: 'Powered by GrowZone',
                                        icon_url: 'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
                                    }
                                }]
                            });
                        }
                        if (subscription <= nowDateMS) {
                            await client.db.delete(`premiumUser.${user}`);
                            member.roles.remove(premiumRole);
                            client.logger.database(`Deleted ${member.user.tag} from premiumUser [Reason: Having expired subscription]`);
                            let logsChannel = client.channels.cache.get(client.config.logsID);
                            logsChannel.send({
                                embeds: [{
                                    title: `Premium Deletion`,
                                    description: `Deleted **${member.user.tag}** from premiumUser \`[Reason: Having expired subscription]\``,
                                    color: `#FF9300`,
                                    footer: {
                                        text: 'Powered by GrowZone',
                                        icon_url: 'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
                                    }
                                }]
                            });
                        }
                    }
                )
            )
        }
        if (userID.length > 0) {
            await Promise.all(
                userID.map(
                    async (user) => {
                        const member = await guild.members.fetch(user);
                        let userHasRole = member._roles.indexOf(client.config.premiumID) >= 0;
                        // console.log(userHasRole) false
                        let expiredAt = await client.db.get(`premiumUser.${user}`)
                        if (nowDateMS >= expiredAt) {
                            await client.db.delete(`premiumUser.${user}`);
                            member.roles.remove(premiumRole);
                            client.logger.database(`Deleted ${member.user.tag} from premiumUser [Reason: Having expired subscription]`);
                            let logsChannel = client.channels.cache.get(client.config.logsID);
                            logsChannel.send({
                                embeds: [{
                                    title: `Premium Deletion`,
                                    description: `Deleted **${member.user.tag}** from premiumUser \`[Reason: Having expired subscription]\``,
                                    color: `#FF9300`,
                                    footer: {
                                        text: 'Powered by GrowZone',
                                        icon_url: 'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
                                    }
                                }]
                            });
                        }
                    },
                ),
            )
        }
    }, 5000)

};