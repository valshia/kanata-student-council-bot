import { CommandInteraction } from 'discord.js';
import { Guide, guide_init, guide_titles, guide_contents, infoEmbed, errorEmbed } from '../messages';

const { MessageActionRow, MessageButton } = require('discord.js');
const client = require('../index');


const row_jp = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('jpToDoFirst')
      .setLabel('0️⃣ 初めにやること')
      .setStyle('PRIMARY'),
  )
  .addComponents(
    new MessageButton()
      .setCustomId('jpHowToEnjoy')
      .setLabel('1️⃣ サーバの楽しみ方')
      .setStyle('PRIMARY'),
  )
  .addComponents(
    new MessageButton()
      .setCustomId('jpChannelList')
      .setLabel('2️⃣ チャンネル一覧')
      .setStyle('PRIMARY'),
  )
  .addComponents(
    new MessageButton()
      .setCustomId('jpOtherInfo')
      .setLabel('3️⃣ その他の情報')
      .setStyle('PRIMARY'),
  );

const row_en = new MessageActionRow()
  .addComponents(
    new MessageButton()
      .setCustomId('enToDoFirst')
      .setLabel('0️⃣ To do first')
      .setStyle('PRIMARY'),
  )
  .addComponents(
    new MessageButton()
      .setCustomId('enHowToEnjoy')
      .setLabel('1️⃣ How to enjoy our server')
      .setStyle('PRIMARY'),
  )
  .addComponents(
    new MessageButton()
      .setCustomId('enChannelList')
      .setLabel('2️⃣ List of channels')
      .setStyle('PRIMARY'),
  )
  .addComponents(
    new MessageButton()
      .setCustomId('enOtherInfo')
      .setLabel('3️⃣ Other information')
      .setStyle('PRIMARY'),
  );

module.exports = {
  data: {
    name: 'guide',
    description: 'Show server guides.',
    options: [{
      type: 'STRING',
      name: 'language',
      description: 'Language select',
      required: true,
      choices: [
        { name: 'English', value: 'en' },
        { name: 'Japanese', value: 'jp' }
      ],
    }]
  },

  async execute(interaction: CommandInteraction) {
    const lang = interaction.options.get('language');
    if (lang === null) {
      interaction.reply({
        embeds: [errorEmbed('`url` slash command parameter is missing. This should not happen if the bot is properly configured.')]
      });
      return;
    }
    if (lang.value === 'en') {
      await interaction.reply({embeds: [infoEmbed(guide_init.en_title, guide_init.en_content)], components: [row_en]});
    } else if (lang.value === 'jp') {
      await interaction.reply({embeds: [infoEmbed(guide_init.jp_title, guide_init.jp_content)], components: [row_jp]});
    }
  },
};

client.on('interactionCreate', async (interaction: CommandInteraction) => {
  if (!interaction.isButton()) {
    return;
  }
  const emb_title = guide_titles[interaction.customId as keyof Guide];
  const emb_content = guide_contents[interaction.customId as keyof Guide];
  if (emb_title != null && emb_content != null) {
    await interaction.reply({
      embeds: [infoEmbed(emb_title, emb_content)],
      ephemeral: true
    });
  }
});
