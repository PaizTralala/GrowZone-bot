module.exports = {
	name: 'testdb',
	description: 'Example cmd',
	usage: '<prefix>example [example]',
	examples: ['example'],
	aliases: ['eg'],
	dir: 'Owner',
	cooldown: 1,
	permissions: [],

	run: async (client, message, args) => {
		let lol = await client.db.get(`premiumUser`);
		let premUser = Object.keys(lol);

		let guild = client.guilds.cache.get(client.config.serverID);
		const role = await guild.roles.fetch(client.config.premiumID);
		const premUsers = guild.roles.cache.get(client.config.premiumID).members.map((x) => x.user.id);
		if (args[0] === `del`) {
			await client.db.delete(`premiumUser`);
			message.channel.send(`success`);
		} else if (args[0] === `add`) {
			await Promise.all(
				premUser.map(async (userID) => {
					const member = await guild.members.fetch(userID);
					member.roles.add(role);
				}),
			);
			message.channel.send(`Success add role`);
		} else if (args[0] === `test`) {
			let testrole = guild.roles.cache.get(client.config.premiumID).members.map((x) => x.user.id);
			let premiumUser = await client.db.get(`premiumUser`);
			if (!premiumUser || premiumUser === null) return;
			const expirationTime = Object.values(premiumUser);
			const userID = Object.keys(premiumUser);
			let mappedExpirationTime = expirationTime.map(async (expireDate) => {
				console.log(expireDate);
			});
			if (userID.length > 0) {
				console.log(userID);
			}
		} else {
			return message.channel.send(`wrong option`);
		}
	},
};
