import { messages } from '../messages';

module.exports = {
  data: {
    name: 'konkanata',
    description: 'Hei! KonKanata!',
  },
  async execute(interaction: any) {
    await interaction.reply({content: messages.hello, ephemeral: true});
  },
};
