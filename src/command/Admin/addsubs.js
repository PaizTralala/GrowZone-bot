module.exports = {
    name: 'addsubs',
    description: 'Add subscription to user',
    usage: '<prefix>addsubs <@user> [days]',
    examples: ['addsubs @Ritshu#0228 31'],
    aliases: ['addsub'],
    dir: "Admin",
    cooldown: 1,
    permissions: [],

    run: async (client, message, args) => {

        if (message.member.roles.cache.find(x => x.name === "Administrator") || message.member.roles.cache.find(x => x.name === "President") || message.member.roles.cache.find(x => x.name === "🔑")) {
            let user = args[0];
            user = getMember(message, args[0]).user;
            let guild = client.guilds.cache.get(client.config.serverID);
            const premiumRole = await guild.roles.fetch(client.config.premiumID);
            if (!user) return;

            let duration = args[1];
            if (isNaN(duration)) return message.channel.send("invalid duration");

            const member = await guild.members.fetch(user.id);
            if (user && duration) {
                let durationMS = duration * 86400000;
                let durationToDB = Date.now() + durationMS;
                let exist = await client.db.get(`premiumUser.${user.id}`);
                if (exist) {
                    let addSubs = durationMS;
                    await client.db.add(`premiumUser.${user.id}`, addSubs);
                    message.channel.send(`Succesfully added \`${duration} Days\` of premium subscription to **${user.tag}**`);
                } else {
                    await client.db.add(`premiumUser.${user.id}`, durationToDB);
                    message.channel.send(`Succesfully added \`${duration} Days\` of premium subscription to **${user.tag}**`);
                    member.roles.add(premiumRole);
                }
            }

            function getMember(message, toFind = '') {
                toFind = toFind.toLowerCase();
                let target = message.guild.members.cache.get(toFind);

                if (!target && message.mentions.members) target = message.mentions.members.first();

                if (!target && toFind) {
                    target = message.guild.members.cache.find(member => {
                        return (
                            member.displayName.toLowerCase().includes(toFind) ||
                            member.user.tag.toLowerCase().includes(toFind)
                        );
                    });
                }

                // invalid user given
                if (!target) return message.channel.send(`Please provide a valid user to add premium subscription`);

                return target;
            }

        }
    }
}