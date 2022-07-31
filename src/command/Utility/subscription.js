module.exports = {
    name: 'subscription',
    description: 'Shows duration of premium subscriptons on Growzone server',
    usage: '<prefix>subscription <@user>',
    examples: ['subscription', 'subscription @Ritshu#0228'],
    aliases: ['subs'],
    dir: "Utility",
    cooldown: 1,
    permissions: [],
    
    run :async (client, message, args) => {   
        let user = getMember(message, args.join(' ')).user;
        if (!user) return;

        let premiumLeft = await client.db.get(`premiumUser.${user.id}`);
        if (!premiumLeft) return message.channel.send(`${user.username} does not have premium subscription`);
        
        let premiumEndsIn = new Date(premiumLeft);


        message.channel.send({ 
            embeds: [{
                color: client.color.messagecolor.cyan,
                title: `${user.username}'s Subscription`,
                description: `Your subscription ends in \`${premiumEndsIn.toLocaleDateString('en-US')}\` at \`${premiumEndsIn.toLocaleTimeString('en-US')}\``
            }]
        });

        function getMember(message, toFind = '') {
            toFind = toFind.toLowerCase();
    
            let target = message.guild.members.cache.get(toFind);
    
            if (!target && message.mentions.members)
                target = message.mentions.members.first();
    
            if (!target && toFind) {
                target = message.guild.members.cache.find(member => {
                    return (
                        member.displayName.toLowerCase().includes(toFind) ||
                        member.user.tag.toLowerCase().includes(toFind)
                    );
                });
            }
    
            if (!toFind) target = message.member;
            if (!target) return message.channel.send(`Can't fetch given user`);
    
            return target;
        }
    }
}