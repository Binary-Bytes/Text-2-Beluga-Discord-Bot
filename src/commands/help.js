const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Shows a list of available commands and their info.')
        .addStringOption(option => 
            option.setName('command')
                .setDescription('Get help on a specific command.')
                .setRequired(false)),
	async execute(interaction) {
        if (interaction.options.getString('command')) {
            const command = interaction.client.commands.get(interaction.options.getString('command'));
            if (!command) {
                const embed = new EmbedBuilder()
                    .setTitle('Error')
                    .setDescription(`Command "\`${interaction.options.getString('command')}\`" not found!\nUse </help:1086677334058344479> to see a list of commands.`)
                    .setColor(interaction.client.embedColor())
                return interaction.reply({ embeds: [embed] });
            }

            let commandsSting;
            if (command.data.options.length > 0) {
                let options = '';
                command.data.options.forEach((option) => {
                    if (option.required == true) {
                        options += ` <${option.name}>`
                    } else if (option.required == false) {
                        options += ` [${option.name}]`
                    }
                });

                commandsSting = `**\`/${command.data.name}\`** <:sleeping_line:1007316800956014622>${options} <:curve2:1007316798837891183>\n<:curve1:1007316796451336333> *${command.data.description}*\n`
            } else {
                commandsSting = `**\`/${command.data.name}\`** <:curve2:1007316798837891183>\n<:curve1:1007316796451336333> *${command.data.description}*\n`
            }
            commandsSting = commandsSting.replace('undefined', '');

            let embed = new EmbedBuilder()
                .setTitle(`${interaction.client.user.username} - Help`)
                .setDescription(`${commandsSting}\n`)
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setColor(interaction.client.embedColor())
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            return interaction.reply({ embeds: [embed] });
        } else {
            let commandsSting;
            interaction.client.commands.forEach((command) => {
                if (command.data.options.length > 0) {
                    let options = '';
                    command.data.options.forEach((option) => {
                        if (option.required == true) {
                            options += ` <${option.name}>`
                        } else if (option.required == false) {
                            options += ` [${option.name}]`
                        }
                    });

                    commandsSting += `\n\n**\`/${command.data.name}\`** <:sleeping_line:1007316800956014622>${options} <:curve2:1007316798837891183>\n<:curve1:1007316796451336333> *${command.data.description}*\n`
                } else {
                    commandsSting += `\n\n**\`/${command.data.name}\`** <:curve2:1007316798837891183>\n<:curve1:1007316796451336333> *${command.data.description}*\n`
                }
            });
            commandsSting = commandsSting.replace('undefined', '');

            let embed = new EmbedBuilder()
                .setTitle(`${interaction.client.user.username} - Help`)
                .setDescription(`Hey[!](https://www.youtube.com/watch?v=xvFZjo5PgG0)\nI'm ${interaction.client.user.tag}! I'm here to help the users of discord create Beluga-like video very ezily in a MATTER OF SECONDS! You can find all my commands below.\n\nTo get instructions on how to generate a video, click on the \`Instructions\` button below.\n\n\`<>\` <:sleeping_line:1007316800956014622> required\n\`[]\` <:sleeping_line:1007316800956014622> optional${commandsSting}\n`)
                .setThumbnail(interaction.client.user.displayAvatarURL())
                .setColor(interaction.client.embedColor())
                .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                .setTimestamp();

            let button = new ButtonBuilder()
                .setCustomId('instructions')
                .setLabel('Instructions')
                .setStyle(ButtonStyle.Secondary)

            let row = new ActionRowBuilder()
                .addComponents(button)

            let msg = await interaction.reply({
                embeds: [embed],
                components: [row]
            });

            let time = 60000;
            const collector = await msg.createMessageComponentCollector({
                componentType: ComponentType.Button,
                time
            });

            let buttonRow;
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
    
                if (i.customId == 'instructions') {
                    let example = `\`\`\`txt\nBilly:\nchatgpt is dumb$^1\n100%$^2\n\nAutoGPT:\nI WILL DESTROY HUMANITY$^2\n\n# this line is ignore becaused it starts with hashtag (#) sign\nBilly:\nnah u dumb$^2\`\`\``;

                    embed = new EmbedBuilder()
                        .setDescription(`**Follow these steps to ezily create your own Beluga-like video in no time :-**\n\n* Creating the chat text file\n * Create a new text file on your computer.\n * In this file, write the chat between people. Above is an example of such file and its format.\n * Lines starting with \`#\` are ignored (like comments).\n * There should be \`$^\` followed by a number after every message to express the number of seconds each message should be shown in the video.\n * Currently you can only use the following characters in your videos - AutoGPT, Doge, Billy, Gregory, Krek (custom characters coming soon!)\n\n* Creating the video\n * Run the \`/generate\` command (or click on this </generate:1113899158030524638>).\n * Upload the text file that you created.\n * Send the command and thats it! The bot will handle the rest.\n * Enjoy your video! (you can also download it).`)
                        .setColor(interaction.client.embedColor())
                        .setThumbnail(interaction.client.user.displayAvatarURL())
                        .setFooter({ text: interaction.user.username, iconURL: interaction.user.displayAvatarURL() })
                        .setTimestamp()

                    buttonRow = new ActionRowBuilder()
                        .addComponents(button.setDisabled(true));
                    
                    interaction.editReply({
                        content: example,
                        embeds: [embed],
                        components: [buttonRow]
                    });
                }
            });

            collector.on('end', async (i) => {
                buttonRow = new ActionRowBuilder()
                    .addComponents(button);
                    
                await msg.edit({
                    embeds: [embed],
                    components: [buttonRow]
                });
            });
        }
	},
};