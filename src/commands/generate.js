const { SlashCommandBuilder, AttachmentBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { spawn } = require("child_process");
const fs = require("fs");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("generate")
		.setDescription(
			"Generates a beluga-like video based on the chat file given."
		)
        .addAttachmentOption((option) => option
            .setRequired(true)
            .setName('file')
            .setDescription('Upload a chat file (.txt)')
        ),

	async execute(interaction) {
        await interaction.deferReply();

        if (!interaction.options.getAttachment('file').name.endsWith('.txt')) {
            const failedEmbed = new EmbedBuilder()
                .setColor(interaction.client.embedColor())
                .setDescription('The chat file must be a .txt');

            interaction.editReply({
                embeds: [failedEmbed]
            });
        }

		const pythonProcess = spawn("python3", ["./src/code/generate_chat.py", interaction.options.getAttachment('file').url]);
        let folder;
        let output;

		pythonProcess.stdout.on("data", (data) => {
            output = data.toString().trim();

            if (output.startsWith('[err]')) {
                let embed = new EmbedBuilder()
                    .setColor(interaction.client.embedColor())
                    .setDescription(output.replace('[err]', '**[err]**'))
                
                return interaction.editReply({
                    embeds: [embed]
                });
            } else {
                folder = `./${output}/output.mp4`;
            }
			console.log(`Command output: ${data}`);
		});

		pythonProcess.stderr.on("data", (data) => {
			console.error(`Error executing command: ${data}`);
		});

		pythonProcess.on("close", async (code) => {
            if (output.startsWith('[err]')) return;

			const video = new AttachmentBuilder(`./${folder}`);
            const reply = await interaction.editReply({ files: [video] });

            let button;
            reply.attachments.forEach(att => {
                button = new ButtonBuilder()
                    .setLabel('Download')
                    .setURL(att.attachment)
                    .setStyle(ButtonStyle.Link);
            });

            const row = new ActionRowBuilder()
			    .addComponents(button);

            await interaction.editReply({ 
                files: [video],
                components: [row]
            });

            deleteFolderRecursive(folder.replace('output.mp4', ''));
		});
	},
};

const deleteFolderRecursive = (path) => {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach((file) => {
            const curPath = `${path}/${file}`;
            if (fs.lstatSync(curPath).isDirectory()) {
                // Recursively delete subdirectories
                deleteFolderRecursive(curPath);
            } else {
                // Delete file
                fs.unlinkSync(curPath);
            }
        });

        // Delete the empty directory
        fs.rmdirSync(path);
    }
}