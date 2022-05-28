const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');


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

  async execute(interaction: any) {
    const emb_jp = new MessageEmbed()
      .setColor('#0055ff')
      .setTitle('サーバのご案内')
      .setDescription(
        `私達のサーバへようこそ！知りたい情報のボタンを押してください。`
      );

    const emb_en = new MessageEmbed()
      .setColor('#0055ff')
      .setTitle('Server Information')
      .setDescription(
        `Welcome to our server! Please press the button for the information you want to know.`
      );

      const row_jp = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('zeroFirst')
            .setLabel('0️⃣ 初めにやること')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId('oneHowToEnjoy')
            .setLabel('1️⃣ サーバの楽しみ方')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId('twoChannels')
            .setLabel('2️⃣ チャンネル一覧')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId('threeAdditional')
            .setLabel('3️⃣ 追加ロール')
            .setStyle('PRIMARY'),
        );

      const row_en = new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setCustomId('zeroFirstEn')
            .setLabel('0️⃣ To do first')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId('oneHowToEnjoyEn')
            .setLabel('1️⃣ How to enjoy our server')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId('twoChannelsEn')
            .setLabel('2️⃣ List of channels')
            .setStyle('PRIMARY'),
        )
        .addComponents(
          new MessageButton()
            .setCustomId('threeAdditionalEn')
            .setLabel('3️⃣ Additional Roles')
            .setStyle('PRIMARY'),
        );

    const lang = interaction.options.get('language');
    if (lang.value === 'en') {
      await interaction.reply({embeds: [emb_en], components: [row_en]});
    } else if (lang.value === 'jp') {
      await interaction.reply({embeds: [emb_jp], components: [row_jp]});
    }
  },
};
