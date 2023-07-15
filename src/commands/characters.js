const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("characters")
		.setDescription(
			"[COMING SOON] View, add, delete and edit your custom characters to be used in your videos."
		),

	async execute(interaction) {
        await interaction.deferReply();

        let buttons = {
            builtin: new ButtonBuilder()
                .setCustomId('builtin')
                .setLabel('Built In')
                .setStyle(ButtonStyle.Secondary),

            view: new ButtonBuilder()
                .setCustomId('view')
                .setLabel('View My')
                .setStyle(ButtonStyle.Secondary),

            add: new ButtonBuilder()
                .setCustomId('add')
                .setLabel('Add')
                .setStyle(ButtonStyle.Secondary),
            
            edit: new ButtonBuilder()
                .setCustomId('edit')
                .setLabel('Edit')
                .setStyle(ButtonStyle.Secondary),

            del: new ButtonBuilder()
                .setCustomId('delete')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger),

            builtinDisabled: new ButtonBuilder()
                .setCustomId('builtin')
                .setLabel('Built In')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            viewDisabled: new ButtonBuilder()
                .setCustomId('view')
                .setLabel('View My')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            addDisabled: new ButtonBuilder()
                .setCustomId('add')
                .setLabel('Add')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),

            editDisabled: new ButtonBuilder()
                .setCustomId('edit')
                .setLabel('Edit')
                .setStyle(ButtonStyle.Secondary)
                .setDisabled(true),
            
            delDisabled: new ButtonBuilder()
                .setCustomId('delete')
                .setLabel('Delete')
                .setStyle(ButtonStyle.Danger)
                .setDisabled(true)
        }

        let buttonRow = new ActionRowBuilder()
            .addComponents(buttons.builtin, buttons.addDisabled, buttons.editDisabled, buttons.delDisabled);

        let embed = new EmbedBuilder()
            .setColor(interaction.client.embedColor())
            .setDescription('The ability to add custom characters coming soon! Till then you can enjoy the built-in characters :)')
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        let msg = await interaction.editReply({
            embeds: [embed],
            components: [buttonRow],
            fetchReply: true
        });

        let time = 60000;
        const collector = await msg.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time
        });

        collector.on('collect', async (i) => {
            if (i.user.id != interaction.user.id) {
                const embed = new EmbedBuilder()
                    .setDescription('You can\'t use these buttons!')
                    .setColor(interaction.client.embedColor())

                return i.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }

            await i.reply({
                content: 'Updating..',
                ephemeral: true
            }).then((m) => {
                m.delete();
            });

            if (i.customId == 'builtin') {
                embed = new EmbedBuilder()
                    .setDescription('Built-in characters that can be used to make your videos are :-\n\n**1.** AutoGPT\n**2.** Doge\n**3.** Billy\n**4.** Gregory\n**5.** Krek')
                    .setColor(interaction.client.embedColor())
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

                buttonRow = new ActionRowBuilder()
                    .addComponents(buttons.view, buttons.addDisabled, buttons.editDisabled, buttons.delDisabled)
                
                interaction.editReply({
                    embeds: [embed],
                    components: [buttonRow]
                });
            } else if (i.customId == 'view') {
                buttonRow = new ActionRowBuilder()
                    .addComponents(buttons.builtin, buttons.addDisabled, buttons.editDisabled, buttons.delDisabled);

                embed = new EmbedBuilder()
                    .setColor(interaction.client.embedColor())
                    .setDescription('The ability to add custom characters coming soon! Till then you can enjoy the built-in characters :)')
                    .setThumbnail(interaction.client.user.displayAvatarURL())
                    .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                    .setTimestamp();

                await interaction.editReply({
                    embeds: [embed],
                    components: [buttonRow],
                    fetchReply: true
                });
            }

            collector.resetTimer();
        });

        collector.on('end', async (i) => {
            buttonRow = new ActionRowBuilder()
                .addComponents(buttons.builtinDisabled, buttons.addDisabled, buttons.editDisabled, buttons.delDisabled)
                
            await msg.edit({
                embeds: [embed],
                components: [buttonRow]
            });
        });
	},
};
