import { messages } from '../messages';
const { MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
  data: {
    name: 'test',
    description: 'test',
  },
  async execute(interaction: any) {
    const row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('primary')
          .setLabel('Primary')
          .setStyle('PRIMARY'),
      );
    await interaction.reply({content: messages.test, components: [row], ephemeral: true});
  },
};
