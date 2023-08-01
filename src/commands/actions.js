const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('actions')
		.setDescription('[OWNER] Actions to control the bot.'),

	async execute(interaction) {
		if (interaction.user.id !== '824173216750764032') {
			let embed = new EmbedBuilder()
				.setColor(interaction.client.embedColor())
				.setDescription('This command is not for you! [OWNER] only :)')

			return interaction.reply({
				embeds: [embed]
			});
		}
		
		await interaction.deferReply();

		let status = interaction.client.miscDB.get('locked');
		if (status == undefined || status == false) { status = 'Unlocked'; }
		else if (status == true) { status = 'Locked'; }

		let embed = new EmbedBuilder()
			.setColor(interaction.client.embedColor())
			.setDescription(`Current bot status :\n**${status}**\n\nChoose an action.`)

		let buttons = {
			lock: new ButtonBuilder()
				.setCustomId('lock')
				.setLabel('Lock')
				.setStyle(ButtonStyle.Danger),

			unlock: new ButtonBuilder()
				.setCustomId('unlock')
				.setLabel('Unlock')
				.setStyle(ButtonStyle.Success),

			lockDisabled: new ButtonBuilder()
				.setCustomId('lock')
				.setLabel('Lock')
				.setStyle(ButtonStyle.Danger)
				.setDisabled(true),

			unlockDisabled: new ButtonBuilder()
				.setCustomId('unlock')
				.setLabel('Unlock')
				.setStyle(ButtonStyle.Success)
				.setDisabled(true)
		}

		let row = new ActionRowBuilder()
			.addComponents(buttons.lock, buttons.unlock);

		let msg = await interaction.editReply({
			embeds: [embed],
			components: [row],
			ephemeral: true,
			fetchReply: true
		});

		let time = 60000;
		const collector = await msg.createMessageComponentCollector({
			componentType: ComponentType.Button,
			time
		});

		collector.on('collect', async (i) => {
			await i.reply({
				content: 'Updating..',
				ephemeral: true
			}).then((m) => {
				m.delete();
			});

			if (i.customId == 'lock') {
				await interaction.client.miscDB.set('locked', true);

				embed = new EmbedBuilder()
					.setColor(interaction.client.embedColor())
					.setDescription('Bot successfully locked :)')
			} else if (i.customId == 'unlock') {
				await interaction.client.miscDB.set('locked', false);

				embed = new EmbedBuilder()
					.setColor(interaction.client.embedColor())
					.setDescription('Bot successfully unlocked :)')
			}

			row = new ActionRowBuilder()
				.addComponents(buttons.lockDisabled, buttons.unlockDisabled);

			await interaction.editReply({
				embeds: [embed],
				components: [row],
				ephemeral: true
			})
		});

		collector.on('end', async (i) => {
			row = new ActionRowBuilder()
				.addComponents(buttons.lockDisabled, buttons.unlockDisabled);

			await interaction.editReply({
				embeds: [embed],
				components: [row],
				ephemeral: true
			})
		});
	}
}