const { MessageEmbed, CommandInteraction } = require('discord.js');
const moment = require('moment');
require("moment-duration-format");

module.exports = {
	name: 'price-edit',
	description: 'Edit price of bot currencies rate to IDR',
	usage: '<prefix>price-edit item_name:Name item_price:Price item_status:Status',
	examples: ['price item_name:Karuta Ticket item_price:500 item_status:Stable'],
	dir: 'Admin',
    permissions: ['ADMINISTRATOR'],
	cooldown: 5,
	permissions: [],
	options: [
		{
			name: 'item_name',
			description: "Choose item name you want to edit the price",
			type: 3,
			required: true,
			choices: [
				{ name: 'Ticket', value: 'tix' },
				{ name: 'Cowoncy', value: 'owo' },
                { name: 'Wist', value: 'wis' },
                { name: 'Clover', value: 'clv' },
                { name: 'Tomi', value: 'tom' },
                { name: 'Anigold', value: 'ani' },
			],
		},
        {
            name: 'item_price',
            description: 'Input price',
            type: 3,
            required: true,    
        },
        {
            name: `item_status`,
            description: `Price status of the item: Stable/Unstable/Semi Stable`,
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

        const itemPrice = interaction.options.getString('item_price');
        const itemStatus = interaction.options.getString('item_status');

        if (
            interaction.member.roles.cache.find((x) => x.name === 'Admin')
        ) {
            if (isNaN(itemPrice))
                return interaction.reply({
                    content:
                        'Kasih harga yang bener dong 😭😭😭, angka aja jangan ada hurufnya (contoh: 10000)',
                    ephemeral: true,
                });

            const embed = new MessageEmbed().setColor('#9BEEFF').setFooter({
                text: `Powered by GrowZone`,
                iconURL: 'https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif',
            });

            let price = await client.db.get(`itemPrice`);
            let status = await client.db.get(`priceStatus`);
            let manager = await client.db.get(`priceManager`);
            let lastEdit = await client.db.get(`lastEdit`);

            if (interaction.options.getString('item_name') === 'tix') {
                await client.db.set(`itemPrice.ticket`, itemPrice);
                await client.db.set(`priceStatus.ticket`, itemStatus);
                await client.db.set(`priceManager.ticket`, interaction.member.user.id);
                await client.db.set(`lastEdit.ticket`, new Date());
                interaction.reply({
                    embeds: [
                        embed
                            .setTitle(`Success Karuta Ticket Price Edited`)
                            .setDescription(`Price: \`${itemPrice}\` | Status: \`${itemStatus}\` | By: ${interaction.member.user.tag}`)
                    ],
                    ephemeral: true,
                });
            } else if (interaction.options.getString(`item_name`) === 'owo') {
                await client.db.set(`itemPrice.owo`, itemPrice);
                await client.db.set(`priceStatus.owo`, itemStatus);
                await client.db.set(`priceManager.owo`, interaction.member.user.id);
                await client.db.set(`lastEdit.owo`, new Date());
                interaction.reply({
                    embeds: [
                        embed
                            .setTitle(`Success Cowoncy Price Edited`)
                            .setDescription(`Price: \`${itemPrice}\` | Status: \`${itemStatus}\` | By: ${interaction.member.user.tag}`)
                    ],
                    ephemeral: true,
                });
            } else if (interaction.options.getString(`item_name`) === 'wis') {
                await client.db.set(`itemPrice.wist`, itemPrice);
                await client.db.set(`priceStatus.wist`, itemStatus);
                await client.db.set(`priceManager.wist`, interaction.member.user.id);
                await client.db.set(`lastEdit.wist`, new Date());
                interaction.reply({
                    embeds: [
                        embed
                            .setTitle(`Success Wist Price Edited`)
                            .setDescription(`Price: \`${itemPrice}\` | Status: \`${itemStatus}\` | By: ${interaction.member.user.tag}`)
                    ],
                    ephemeral: true,
                });
            } else if (interaction.options.getString(`item_name`) === 'clv') {
                await client.db.set(`itemPrice.clover`, itemPrice);
                await client.db.set(`priceStatus.clover`, itemStatus);
                await client.db.set(`priceManager.clover`, interaction.member.user.id);
                await client.db.set(`lastEdit.clover`, new Date());
                interaction.reply({
                    embeds: [
                        embed
                            .setTitle(`Success Clover Price Edited`)
                            .setDescription(`Price: \`${itemPrice}\` | Status: \`${itemStatus}\` | By: ${interaction.member.user.tag}`)
                    ],
                    ephemeral: true,
                });
            } else if (interaction.options.getString(`item_name`) === 'tom') {
                await client.db.set(`itemPrice.tomi`, itemPrice);
                await client.db.set(`priceStatus.tomi`, itemStatus);
                await client.db.set(`priceManager.tomi`, interaction.member.user.id);
                await client.db.set(`lastEdit.tomi`, new Date());
                interaction.reply({
                    embeds: [
                        embed
                            .setTitle(`Success 富 Tomi Price Edited`)
                            .setDescription(`Price: \`${itemPrice}\` | Status: \`${itemStatus}\` | By: ${interaction.member.user.tag}`)
                    ],
                    ephemeral: true,
                });
            } else if (interaction.options.getString(`item_name`) === 'ani') {
                await client.db.set(`itemPrice.anigold`, itemPrice);
                await client.db.set(`priceStatus.anigold`, itemStatus);
                await client.db.set(`priceManager.anigold`, interaction.member.user.id);
                await client.db.set(`lastEdit.anigold`, new Date());
                interaction.reply({
                    embeds: [
                        embed
                            .setTitle(`Success AniGold Price Edited`)
                            .setDescription(`Price: \`${itemPrice}\` | Status: \`${itemStatus}\` | By: ${interaction.member.user.tag}`)
                    ],
                    ephemeral: true,
                });
            }
        }
    },
};