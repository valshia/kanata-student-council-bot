import { errorEmbed } from './messages';
import { CommandInteraction } from 'discord.js';
import dotenv from 'dotenv';
import { CommandInteraction } from 'discord.js';
import * as messagewatcher from './messagewatcher';
import { errorEmbed } from './messages';

const { Client, Intents } = require('discord.js');
const fs = require('fs');

dotenv.config();

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});
module.exports = client;


let commands: { [key: string]: any } = {};
const commandFiles = fs.readdirSync('./src/commands/').filter((file: string) => file.endsWith('.ts'));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  console.log(command);
  commands[command.data.name] = command;
}

client.once('ready', async () => {
  const data: string [] = [];
  for (const commandName in commands) {
    if (commands.hasOwnProperty(commandName)) {
      data.push(commands[commandName].data);
    }
  }
  await client.application.commands.set(data, process.env.SERVER_ID);
  console.log('Ready!');
  console.log(client.user?.tag);
});

client.on('interactionCreate', async (interaction: CommandInteraction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const command = commands[interaction.commandName];
  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    await interaction.reply({
      embeds: [errorEmbed(
        `Something wrong... Could you try again or contact <@${process.env.ADMIN_ID}> ?\n` +
        `何かがおかしいです……もう一度試していただくか、 <@${process.env.ADMIN_ID}> に連絡ください。`
      )],
      ephemeral: true,
    });
  }
});

client.login(process.env.TOKEN);
