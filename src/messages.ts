const { MessageEmbed } = require('discord.js');


export const messages = {
  hello: 'へい！こんかなた〜！',
  test: 'テスト',
};


export const toDoFirst = new MessageEmbed()
  .setColor('#0055ff')
  .setTitle('最初にやること / To Do First')
  .setDescription(
    `<#975419102158000188>
    チャンネルのテスト`
  );

  export const howToEnjoy = new MessageEmbed()
    .setColor('#0055ff')
    .setTitle('サーバの楽しみ方 / How to enjoy our server')
    .setDescription(
      `<#975419102158000188>
      チャンネルのテスト`
    );
