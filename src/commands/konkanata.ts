import { messages } from '../messages';
import { CommandInteraction } from 'discord.js';

module.exports = {
  data: {
    name: 'konkanata',
    description: 'Hei! KonKanata!',
  },
  async execute(interaction: CommandInteraction) {
    await interaction.reply({content: messages.hello, ephemeral: true});
  },
};
