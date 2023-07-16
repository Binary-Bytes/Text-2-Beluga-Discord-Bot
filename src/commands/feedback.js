const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('feedback')
		.setDescription('Your feedback matters :) Help improve the bot.')
        .addStringOption(option =>
            option.setName('type')
                .setDescription('Feedback type?')
                .setRequired(true)
                .addChoices(
                    { name: 'Feature Request', value: 'feature' },
                    { name: 'Report Bug', value: 'bug' },
                    { name: 'Other', value: 'other' }
                ))
        .addStringOption(option => 
            option.setName('feedback')
                .setDescription('Get help on a specific command.')
                .setRequired(true)),
	async execute(interaction) {
        let embed = new EmbedBuilder()
            .setColor(interaction.client.embedColor())
            .setDescription('Feedback sent ✅\nThanks for helping in development of the bot :)')

        await interaction.reply({
            embeds: [embed]
        });

        switch (interaction.options.getString('type')) {
            case 'feature':
                embed = new EmbedBuilder()
                    .setColor(interaction.client.embedColor())
                    .setTitle('Feature Request')
                    .setDescription(`${interaction.options.getString('feedback')}\n\n\`${interaction.user.username}\``);
                break;

            case 'bug':
                embed = new EmbedBuilder()
                    .setColor(interaction.client.embedColor())
                    .setTitle('Bug Report')
                    .setDescription(`${interaction.options.getString('feedback')}\n\n\`${interaction.user.username}\``);
                break;

            case 'other':
                embed = new EmbedBuilder()
                    .setColor(interaction.client.embedColor())
                    .setTitle('Other Feedback')
                    .setDescription(`${interaction.options.getString('feedback')}\n\n\`${interaction.user.username}\``);
                break;
        } 

        const channel = interaction.client.channels.cache.get('1129078958093242468');
        channel.send({
            embeds: [embed]
        });
    }
}