import { CommandInteraction } from 'discord.js';
import { Guide, guideInit, guideTitles, guideContents, infoEmbed, errorEmbed, guideEmbed } from '../messages';

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
  )
  .addComponents(
    new MessageButton()
      .setCustomId('jpQandA')
      .setLabel('4️⃣ Q&A')
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
  )
  .addComponents(
    new MessageButton()
      .setCustomId('enQandA')
      .setLabel('4️⃣ Q&A')
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
    console.log('Interaction received:', interaction);
    if (lang === null) {
      interaction.reply({
        embeds: [errorEmbed('Slash command parameter is missing. This should not happen if the bot is properly configured.')]
      });
      return;
    }
    if (lang.value === 'en') {
      await interaction.reply({embeds: [infoEmbed(guideInit.en_title, guideInit.en_content)], components: [row_en]});
    } else if (lang.value === 'jp') {
      await interaction.reply({embeds: [infoEmbed(guideInit.jp_title, guideInit.jp_content)], components: [row_jp]});
    }
  },
};

function chunkText(text: string, pageBreakCode: string = "<FF>"): string[] {
  return text.split(pageBreakCode);
}

function createPaginationButtons(page: number, totalPages: number){
  const row = new MessageActionRow().addComponents(
    new MessageButton()
      .setCustomId('prevPage')
      .setLabel('⬅️Previous/前のページ')
      .setStyle('PRIMARY')
      .setDisabled(page === 0),
    new MessageButton()
      .setCustomId('nextPage')
      .setLabel('Next/次のページ➡️')
      .setStyle('PRIMARY')
      .setDisabled(page === totalPages-1),
    new MessageButton()
      .setCustomId('close_ephemeral')
      .setLabel('Close/閉じる')
      .setStyle('DANGER')
  );
  return row;
}

// ボタンのインタラクションを管理するためのマップ
const activeInteractions = new Map<string, { 
  page: number; 
  contentChunks: string[]; 
  title: string; 
  timestamp: number; // データの追加時刻を追跡
}>();

// 定期的に古いデータを削除する
setInterval(() => {
  const now = Date.now();
  activeInteractions.forEach((value, key) => {
    if (now - value.timestamp > 3600000) { // 1時間（3600000ミリ秒）以上経過
      activeInteractions.delete(key);
    }
  });
}, 60000); // 毎分チェック


client.on('interactionCreate', async (interaction: CommandInteraction) => {
  if (!interaction.isButton()) return;
  const now = new Date();
  console.log(`${now}: ${interaction.user.username} just pressed ${interaction.customId} button.`);

  if (interaction.customId === 'close_ephemeral') {
    await interaction.deferUpdate();
    await interaction.deleteReply();

  } else if (interaction.customId == 'prevPage' || interaction.customId == 'nextPage'){
    const customId = interaction.customId;
    const messageId = interaction.message.id;
    const data = activeInteractions.get(messageId);

    if (!data) {
        await interaction.reply({
          content: 'This interaction has expired. Please close it and press the button again. 最初の画面からもう一度お試しください。',
          ephemeral: true
        });
        return;
    }

    const { page, contentChunks, title } = data;

    if (customId === 'nextPage' && page < contentChunks.length - 1) {
        data.page++;
    } else if (customId === 'prevPage' && page > 0) {
        data.page--;
    }

    const newEmbed = guideEmbed(title, contentChunks, data.page);
    const newButtons = createPaginationButtons(data.page, contentChunks.length);

    await interaction.update({ embeds: [newEmbed], components: [newButtons] });

  } else {
    const title = guideTitles[interaction.customId as keyof Guide];
    const content = guideContents[interaction.customId as keyof Guide];
    const contentChunks = chunkText(content);

    const initialEmbed = guideEmbed(title, contentChunks, 0);
    const buttons = createPaginationButtons(0, contentChunks.length);

    const message = await interaction.reply({
      embeds: [initialEmbed],
      components: [buttons],
      fetchReply: true,
      ephemeral: true
    });

    activeInteractions.set(message.id, { 
        page: 0, 
        contentChunks, 
        title, 
        timestamp: Date.now() 
    });
  }
});
