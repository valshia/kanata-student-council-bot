const { MessageEmbed } = require('discord.js');
const { msgJpToDoFirst, msgJpHowToEnjoy, msgJpChannelList, msgJpOtherInfo,
        msgEnToDoFirst, msgEnHowToEnjoy, msgEnChannelList, msgEnOtherInfo } = require('./guide_messages');

export const messages = {
  hello: 'へい！こんかなた〜！',
  test: 'テスト',
};

export interface Guide {
  jpToDoFirst:   string;
  jpHowToEnjoy:  string;
  jpChannelList: string;
  jpOtherInfo:   string;
  enToDoFirst:   string;
  enHowToEnjoy:  string;
  enChannelList: string;
  enOtherInfo:   string;
}

export const guide_init = {
  jp_title: 'サーバのご案内',
  jp_content: '私達のサーバへようこそ！知りたい情報のボタンを押してください。',
  en_title: 'Server Information',
  en_content: 'Welcome to our server! Please press the button for the information you want to know.',
};

export const guide_titles = {
  jpToDoFirst: '0️⃣ 初めにやること',
  jpHowToEnjoy: '1️⃣ サーバの楽しみ方',
  jpChannelList: '2️⃣ チャンネル一覧',
  jpOtherInfo: '3️⃣ その他の情報',
  enToDoFirst: '0️⃣ To do first',
  enHowToEnjoy: '1️⃣ How to enjoy our server',
  enChannelList: '2️⃣ List of channels',
  enOtherInfo: '3️⃣ Other information'
} as Guide;

export const guide_contents = {
  jpToDoFirst: msgJpToDoFirst,
  jpHowToEnjoy: msgJpHowToEnjoy,
  jpChannelList: msgJpChannelList,
  jpOtherInfo: msgJpOtherInfo,
  enToDoFirst: msgEnToDoFirst,
  enHowToEnjoy: msgEnHowToEnjoy,
  enChannelList: msgEnChannelList,
  enOtherInfo: msgEnOtherInfo
} as Guide;

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
