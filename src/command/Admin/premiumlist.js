const { MessageEmbed } = require("discord.js");

module.exports = {
	name: "premiumlist",
	description:
		"Shows all user who have premium subscription and their manager!",
	usage: "<prefix>premiumlist",
	examples: ["premiumlist"],
	aliases: ["list", "premlist"],
	dir: "Admin",
	cooldown: 1,
	permissions: [],

	run: async (client, message, args) => {
		if (
			message.member.roles.cache.find((x) => x.name === '🔑')
		) {
			const getData = await client.db.get("premiumUser");
			const keysSorted = Object.keys(getData).sort(function (a, b) {
				return getData[b] - getData[a];
			});

			let arr = [];
			await Promise.all(
				keysSorted.map(async (x, i) => {
					const getUserData = await client.db.get(`premiumUser.${x}`);
					const getManager = await client.db.get(`premManager.${x}`);
					const getMember = await client.users.fetch(x);

					arr.push(
						`\`[${i + 1}]\` - **${getMember.tag}** - <t:${Math.ceil(getUserData / 1000)}:R> -> \`Managed by:\` *<@${getManager ? getManager : "Unknown"}>*`
					);
				})
			);

			if (arr.length === 0) {
				arr.push(`There are currently no user that have a premium!`);
			}

			const embed = new MessageEmbed()
				.setAuthor({
					name: "Premium List",
					iconURL: message.author.displayAvatarURL({ dynamic: true }),
				})
				.addFields([
					{
						name: "Format",
						value: "`[position] - User - Duration - Manager`",
					},
				])
				.setDescription(
					['List sorted based on longest subscription time!', '', arr.slice(0, getData.length).join("\n")].join("\n")
				)
				.setColor("#9BEEFF")
				.setFooter({
					text: "Powered by GrowZone",
					iconURL:
						"https://cdn.discordapp.com/icons/857396459392729099/a_5f4d3d9a43559fef37d5f20858fef434.gif",
				});

			message.reply({ embeds: [embed] });
		}
	},
};
