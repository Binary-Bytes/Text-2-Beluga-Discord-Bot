const { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, EmbedBuilder } = require('discord.js');

module.exports = {
    async execute(interaction, descs, time = 60000) {
        await interaction.deferReply();

        console.log(descs, descs.length)
        if (descs.length == 1) {
            console.log('TWO')

            let embed = new EmbedBuilder()
                .setColor(interaction.client.embedColor())
                .setDescription(descs[0])
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()

            const page = interaction.editReply({
                embeds: [embed],
                components: [],
                fetchReply: true
            });

            return page;
        }

        console.log('THREE')

        const prev = new ButtonBuilder()
            .setCustomId('prev')
            .setEmoji('◀️')
            .setStyle(ButtonStyle.Primary)
            .setDisabled(true)

        const home = new ButtonBuilder()
            .setCustomId('home')
            .setEmoji('🏠')
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)

        const next = new ButtonBuilder()
            .setCustomId('next')
            .setEmoji('▶️')
            .setStyle(ButtonStyle.Primary)

        const buttonRow = new ActionRowBuilder()
            .addComponents(prev, home, next)
        let index = 0;

        let embed = new EmbedBuilder()
            .setColor(interaction.client.embedColor())
            .setDescription(descs[index])
            .setThumbnail(interaction.client.user.displayAvatarURL())
            .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp()

        let currentPage = await interaction.editReply({
            embeds: [embed],
            components: [buttonRow],
            fetchReply: true
        });

        const collector = await currentPage.createMessageComponentCollector({
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

            i.reply({
                content: 'Updating..',
                ephemeral: true
            }).then((m) => {
                m.delete();
            });

            if (i.customId == 'prev') {
                if (index > 0) index--;
            } else if (i.customId == 'home') {
                index = 0;
            } else if (i.customId == 'next') {
                if (index < descs.length - 1) index++;
            }

            if (index == 0) prev.setDisabled(true);
            else prev.setDisabled(false);

            if (index == 0) home.setDisabled(true);
            else home.setDisabled(false);

            if (index == descs.length - 1) next.setDisabled(true);
            else next.setDisabled(false);

            embed = new EmbedBuilder()
                .setColor(interaction.client.embedColor())
                .setDescription(descs[index])
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()

            await currentPage.edit({
                embeds: [embed],
                components: [buttonRow]
            });

            collector.resetTimer();
        });

        collector.on('end', async (i) => {
            prev.setDisabled(true);
            home.setDisabled(true);
            next.setDisabled(true);

            embed = new EmbedBuilder()
                .setColor(interaction.client.embedColor())
                .setDescription(descs[index])
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp()

            await currentPage.edit({
                embeds: [embed],
                components: [buttonRow]
            });
        });
        return currentPage;
    }
}