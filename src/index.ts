import { toDoFirst, howToEnjoy } from './messages';

const { Client, Intents } = require('discord.js');
const fs = require('fs');
import dotenv from 'dotenv';

dotenv.config();
const server_id = '975417617160491119';

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
});

/*
function printType(x: any) {
  console.log(`${typeof(x)} ${Object.prototype.toString.call(x)}`);
}
*/

var commands: { [key: string]: any } = {};
const commandFiles = fs.readdirSync('./src/commands/').filter((file: string) => file.endsWith('.ts'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands[command.data.name] = command;
}

client.once('ready', async () => {
  const data: string [] = [];
  for (const commandName in commands) {
    if (commands.hasOwnProperty(commandName)) {
      data.push(commands[commandName].data);
    }
  }
  await client.application.commands.set(data, server_id);
  console.log('Ready!');
  console.log(client.user?.tag);
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isCommand()) {
    return;
  }
  const command = commands[interaction.commandName];
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      content: 'smth wrong',
      ephemeral: true,
    });
  }
});

client.on('interactionCreate', async (interaction: any) => {
  if (!interaction.isButton()) {
    return;
  }
  console.log(interaction);
  if (interaction.customId === 'zeroFirst') {
    await interaction.reply({
      embeds: [toDoFirst],
      ephemeral: true
    });
  } else if (interaction.customId === 'oneHowToEnjoy') {
    await interaction.reply({
      embeds: [howToEnjoy],
      ephemeral: true
    });
  }
});

client.login(process.env.TOKEN);
