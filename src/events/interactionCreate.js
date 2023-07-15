const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

        if (interaction.commandName != 'log' && interaction.commandName != 'logtwo') {
            let db = interaction.client.logDB.get(interaction.user.id);
            if (db) {
                let userArr = db;
                userArr.push({
                    time: new Date(interaction.createdAt / 1000).getTime(),
                    command: interaction.commandName,
                    interaction: interaction
                });

                interaction.client.logDB.set(interaction.user.id, userArr);
            } else {
                let userArr = [];
                userArr.push({
                    time: new Date(interaction.createdAt / 1000).getTime(),
                    command: interaction.commandName,
                    interaction: interaction
                });

                interaction.client.logDB.set(interaction.user.id, userArr);
            }
        }

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
            await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};