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

export function errorEmbed(message: string) {
  const emb = new MessageEmbed()
    .setColor('#ff2200')
    .setTitle('Error!')
    .setDescription(message);
  return emb;
}

export function infoEmbed(title: string, message: string) {
  const emb = new MessageEmbed()
    .setColor('#0055ff')
    .setTitle(title)
    .setDescription(message);
  return emb;
}
