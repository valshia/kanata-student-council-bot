const { MessageEmbed } = require('discord.js');
const { msgJpToDoFirst, msgJpHowToEnjoy, msgJpChannelList, msgJpOtherInfo, msgJpQandA,
        msgEnToDoFirst, msgEnHowToEnjoy, msgEnChannelList, msgEnOtherInfo, msgEnQandA } = require('./guide_messages');

export const messages = {
  hello: 'へい！こんかなた〜！',
  test: 'テスト',
};

export interface Guide {
  jpToDoFirst:   string;
  jpHowToEnjoy:  string;
  jpChannelList: string;
  jpOtherInfo:   string;
  jpQandA:       string;
  enToDoFirst:   string;
  enHowToEnjoy:  string;
  enChannelList: string;
  enOtherInfo:   string;
  enQandA:       string;
};

export const guideInit = {
  jp_title: 'サーバのご案内',
  jp_content: '私達のサーバへようこそ！知りたい情報のボタンを押してください。',
  en_title: 'Server Information',
  en_content: 'Welcome to our server! Please press the button for the information you want to know.',
};

export const guideTitles = {
  jpToDoFirst: '0️⃣ 初めにやること',
  jpHowToEnjoy: '1️⃣ サーバの楽しみ方',
  jpChannelList: '2️⃣ チャンネル一覧',
  jpOtherInfo: '3️⃣ その他の情報',
  jpQandA: '4️⃣ Q&A',
  enToDoFirst: '0️⃣ To do first',
  enHowToEnjoy: '1️⃣ How to enjoy our server',
  enChannelList: '2️⃣ List of channels',
  enOtherInfo: '3️⃣ Other information',
  enQandA: '4️⃣ Q&A'
} as Guide;

export const guideContents = {
  jpToDoFirst: msgJpToDoFirst,
  jpHowToEnjoy: msgJpHowToEnjoy,
  jpChannelList: msgJpChannelList,
  jpOtherInfo: msgJpOtherInfo,
  jpQandA: msgJpQandA,
  enToDoFirst: msgEnToDoFirst,
  enHowToEnjoy: msgEnHowToEnjoy,
  enChannelList: msgEnChannelList,
  enOtherInfo: msgEnOtherInfo,
  enQandA: msgEnQandA
} as Guide;

export function errorEmbed(message: string) {
  const emb = new MessageEmbed()
    .setColor('#ff2200')
    .setTitle('Error!')
    .setDescription(message);
  return emb;
};

export function infoEmbed(title: string, message: string) {
  const emb = new MessageEmbed()
    .setColor('#0055ff')
    .setTitle(title)
    .setDescription(message);
  return emb;
};

export function guideEmbed(title: string, contentChunks: string[], page: number){
  const emb = new MessageEmbed()
    .setTitle(title)
    .setDescription(contentChunks[page])
    .setFooter({
      text: `(Page ${page + 1}/${contentChunks.length})`,
    })
    .setColor('#00AAFF');
    return emb
};
