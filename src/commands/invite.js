const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('invite')
		.setDescription('Invite the bot to your server.'),

	async execute(interaction) {
        let embed = new EmbedBuilder()
            .setColor(interaction.client.embedColor())
            .setDescription('Click the button below to invite me to your server [:)](https://www.youtube.com/watch?v=xvFZjo5PgG0)')

        let button = new ButtonBuilder()
            .setLabel('Invite')
            .setStyle(ButtonStyle.Link)
            .setURL('https://discord.com/api/oauth2/authorize?client_id=1113866060739919953&permissions=8&scope=bot%20applications.commands')

        let row = new ActionRowBuilder()
            .addComponents(button);
        
        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
}