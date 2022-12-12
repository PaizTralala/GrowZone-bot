const { MessageEmbed, CommandInteraction } = require('discord.js');
const moment = require('moment');
require("moment-duration-format");

module.exports = {
	name: 'price',
	description: 'Showing price of bot currencies rate to IDR',
	usage: '<prefix>price item_name:Karuta Ticket',
	examples: ['price item_name:Karuta Ticket'],
	dir: 'Utility',
	cooldown: 5,
	permissions: [],
	options: [
		{
			name: 'item_name',
			description: "Choose item name you want to see the price",
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
	],

  /**
   *
   * @param { * } client
   * @param { CommandInteraction } interaction
   */
	run: async (client, interaction) => {
        const embed = new MessageEmbed().setColor('#9BEEFF').setFooter({
            text: 'Note: Price rate are following current rate people buying/selling on GrowZone Marketplace',
        });

		let price = await client.db.get(`itemPrice`);
		let status = await client.db.get(`priceStatus`);
		let manager = await client.db.get(`priceManager`);
        let lastEdit = await client.db.get(`lastEdit`);
        
		if (interaction.options.getString('item_name') === 'tix') {
            const parse = Date.parse(lastEdit.ticket);
            const parse2 = Date.now() - parse;
            const lastEdited = moment.duration(parse2).format(" D [days], H [hours], m [minutes], s [seconds]");
            let Ktix = Number(price.ticket);
			interaction.reply({
                embeds: [
                  embed
                    .setTitle(`Karuta Ticket`)
					.setThumbnail(`https://cdn.discordapp.com/attachments/1021964802869968916/1037223051869306920/image_processing20200511-25230-h60hqs.png`)
                    .addFields(
                        { name: `Edited`, value: `By **<@${manager.ticket}>**, ${lastEdited} ago` },
                        { name: `Price`, value: `\`Rp. ${Ktix.toLocaleString()}\` per **1** 🎟️`, inline: true },
                        { name: `Price Status`, value: `${status.ticket}`, inline: true },
                    )
                ],
            });
		} else if (interaction.options.getString('item_name') === 'owo') {
            const parse = Date.parse(lastEdit.owo);
            const parse2 = Date.now() - parse;
            const lastEdited = moment.duration(parse2).format(" D [days], H [hours], m [minutes], s [seconds]");
            let Powo = Number(price.owo);
			interaction.reply({
                embeds: [
                  embed
                    .setTitle(`Cowoncy`)
					.setThumbnail(`https://cdn.discordapp.com/emojis/857633545757130784.webp?quality=lossless`)
                    .addFields(
                        { name: `Edited`, value: `By **<@${manager.owo}>**, ${lastEdited} ago` },
                        { name: `Price`, value: `\`Rp. ${Powo.toLocaleString()}\` per **1M** <:GZ_Cowoncy:857633545757130784>`, inline: true },
                        { name: `Price Status`, value: `${status.owo}`, inline: true },
                    )
                ],
            });
		}  else if (interaction.options.getString('item_name') === 'wis') {
            const parse = Date.parse(lastEdit.wist);
            const parse2 = Date.now() - parse;
            const lastEdited = moment.duration(parse2).format(" D [days], H [hours], m [minutes], s [seconds]");
			interaction.reply({
                embeds: [
                  embed
                    .setTitle(`Wist`)
					.setThumbnail(`https://cdn.discordapp.com/emojis/959045719782740018.webp?quality=lossless`)
                    .addFields(
                        { name: `Edited`, value: `By **<@${manager.wist}>**, ${lastEdited} ago` },
                        { name: `Price`, value: `\`Rp. ${price.wist.toLocaleString()}\` per **1** <:wistgz:959045719782740018>`, inline: true },
                        { name: `Price Status`, value: `${status.wist}`, inline: true },
                    )
                ],
            });
		} else if (interaction.options.getString('item_name') === 'clv') {
            const parse = Date.parse(lastEdit.clover);
            const parse2 = Date.now() - parse;
            const lastEdited = moment.duration(parse2).format(" D [days], H [hours], m [minutes], s [seconds]");
			interaction.reply({
                embeds: [
                  embed
                    .setTitle(`Clover`)
					.setThumbnail(`https://cdn.discordapp.com/attachments/1021964802869968916/1037223052276142161/kisspng-shamrock-four-leaf-clover-saint-patricks-day-logo-cropped-aflc1-png-5cb9e941f40e60.3010229015556877459997.png`)
                    .addFields(
                        { name: `Edited`, value: `By **<@${manager.clover}>**, ${lastEdited} ago` },
                        { name: `Price`, value: `\`Rp. ${price.clover.toLocaleString()}\` per **1** 🍀`, inline: true },
                        { name: `Price Status`, value: `${status.clover}`, inline: true },
                    )
                ],
            });
		} else if (interaction.options.getString('item_name') === 'tom') {
            const parse = Date.parse(lastEdit.tomi);
            const parse2 = Date.now() - parse;
            const lastEdited = moment.duration(parse2).format(" D [days], H [hours], m [minutes], s [seconds]");
			interaction.reply({
                embeds: [
                  embed
                    .setTitle(`富 Tomi`)
					.setThumbnail(`https://cdn.discordapp.com/attachments/1021964802869968916/1037222891361681468/unknown.png`)
                    .addFields(
                        { name: `Edited`, value: `By **<@${manager.tomi}>**, ${lastEdited} ago` },
                        { name: `Price`, value: `\`Rp. ${price.tomi.toLocaleString()}\` per **富 1**`, inline: true },
                        { name: `Price Status`, value: `${status.tomi}`, inline: true },
                    )
                ],
            });
		} else if (interaction.options.getString('item_name') === 'ani') {
            const parse = Date.parse(lastEdit.anigold);
            const parse2 = Date.now() - parse;
            const lastEdited = moment.duration(parse2).format(" D [days], H [hours], m [minutes], s [seconds]");
            let nigol = Number(price.anigold);
			interaction.reply({
                embeds: [
                  embed
                    .setTitle(`Anigold`)
					.setThumbnail(`https://cdn.discordapp.com/attachments/1021964802869968916/1037935978641358848/704242802522980462.webp`)
                    .addFields(
                        { name: `Edited`, value: `By **<@${manager.anigold}>**, ${lastEdited} ago` },
                        { name: `Price`, value: `\`Rp. ${nigol.toLocaleString()}\` per **1M** Gold`, inline: true },
                        { name: `Price Status`, value: `${status.anigold}`, inline: true },
                    )
                ],
            });
		}
	},
};