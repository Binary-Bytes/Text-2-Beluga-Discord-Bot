const { Events, EmbedBuilder } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			let isLocked = interaction.client.miscDB.get('locked');

			if (isLocked != undefined) {
				if (isLocked) isLocked = true;
				if (!isLocked) isLocked = false;
			} else {
				isLocked = false;
			}

			if (isLocked) {
				if (interaction.user.id == '824173216750764032') {
					return await command.execute(interaction);
				} else {
					let embed = new EmbedBuilder()
						.setColor(interaction.client.embedColor())
						.setDescription('Due to some internal errors, I\'m currently stopped. Hopefully all errors will be resolved soon :)\n\n* Till then try this cool trick :\n * Run `/msg` in any channel of Discord\n * In the user option, paste this number - `1081004946872352958`\n * And in message option, type `hello` and send\nCheck out what happens ;)')
	
					return interaction.reply({
						embeds: [embed]
					});
				}
			} else {
				await command.execute(interaction);
			}
		} catch (error) {
			let embed1 = new EmbedBuilder()
				.setColor(interaction.client.embedColor())
				.setDescription(`Error executing ${interaction.commandName} D:\nIf this issue keeps on happening, please send bug report through </feedback:1130916369135833118> :)`)

			let embed2 = new EmbedBuilder()
				.setColor(interaction.client.embedColor())
				.setDescription(`Error executing ${interaction.commandName} D:\n\n${error}`)

			interaction.editReply({
				embeds: [embed1]
			});

			const channel = interaction.client.channels.cache.get('1130923963636265011');
			return channel.send({
				embeds: [embed2]
			});
		}
	},
};