require('dotenv').config();

const Enmap = require('enmap');
const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const { TOKEN } = process.env

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.embedColor = () => {
    let colors = ['#99ffb4', '#cfa6ff', '#ffb0e1', '#ffc973', '#926eff']
    return colors[Math.floor(Math.random() * colors.length)];
}

client.format = (text) => {
    text = text.replaceAll('[gray]', '\u001b[0;30m');
    text = text.replaceAll('[red]', '\u001b[0;31m');
    text = text.replaceAll('[green]', '\u001b[0;32m');
    text = text.replaceAll('[yellow]', '\u001b[0;33m');
    text = text.replaceAll('[blue]', '\u001b[0;34m');
    text = text.replaceAll('[pink]', '\u001b[0;35m');
    text = text.replaceAll('[cyan]', '\u001b[0;36m');
    text = text.replaceAll('[white]', '\u001b[0;37m');

    text = text.replaceAll('[end]', '\u001b[0;0m');

    return text;
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}

const chars = new Enmap({
    name: 'chars',
    dataDir: './src/data/chars/'
});

const log = new Enmap({
    name: 'log',
    dataDir: './src/data/log/'
});

client.charsDB = chars;
client.logDB = log;

client.login(TOKEN);