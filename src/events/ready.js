const { Events, ActivityType } = require('discord.js');
const deploy = require('../functions/deploy-commands')

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		client.user.setActivity({
			name: `${client.guilds.cache.size} Servers`,
			type: ActivityType.Watching,
		});

		deploy.execute(client);
	},
};