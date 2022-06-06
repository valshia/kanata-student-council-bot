import { CommandInteraction } from 'discord.js';
import { errorEmbed, infoEmbed } from '../messages';
import Youtube from 'youtube.ts';
import dotenv from 'dotenv';

dotenv.config();
const youtube = new Youtube(process.env.GOOGLE_API_KEY);
let url: string|null;

module.exports = {
  data: {
    name: 'watchalong',
    description: 'Set a YouTube stream URL and it will be pinned. When the stream is over, notify and unpinned.',
    options: [{
      type: 'STRING',
      name: 'url',
      description: 'Stream URL',
      required: true
    }]
  },
  async execute(interaction: CommandInteraction) {
    return notifyStreamEndSlashCommandHandler(interaction);
  },
};

const notifyStreamEndSlashCommandHandler = async (interaction: CommandInteraction): Promise<void> => {
  url = interaction.options.getString('url');
  let pinMessage;

  if (url === null) {
    await interaction.reply({
      embeds: [errorEmbed('`url` slash command parameter is missing. This should not happen if the bot is properly configured.')]
    });
    return
  }

  const videoInfo = await youtube.videos.get(url);
  if (videoInfo === undefined) {
    interaction.reply({
      embeds: [errorEmbed('Cannot get stream info. Did you set stream URL?\n配信の情報が取得できません。配信のURLを指定しましたか？')]
    });
    console.error(videoInfo);
  } else if (videoInfo.snippet.liveBroadcastContent === 'none') {
    interaction.reply({
      embeds: [errorEmbed('This stream is already over or this is not stream.\n指定されたURLの配信は既に終わっているか、配信ではありません。')]
    });
  } else if (videoInfo.snippet.liveBroadcastContent === undefined) {
    interaction.reply({
      embeds: [errorEmbed('Invalid URL.\n無効なURLです。')]
    });
  } else if (videoInfo.snippet.liveBroadcastContent === 'live') {
    if (interaction.channel === null) {
      console.error('Tried to send a message for a channel that no longer exists.');
    } else {
      await interaction.reply({
          embeds: [infoEmbed(
          `Let's watchalong!`,
          `I will notify you when this stream ends.\nこの配信が終わったら通知します。\n${url}`
        )]
      });
      pinMessage = await interaction.channel.send(`We're watching: ${url}`);
      await pinMessage.pin();
    }

    await watchForStreamEnd(url);

    if (interaction.channel === null) {
      console.error('Tried to send a message for a channel that no longer exists.');
    } else {
      await interaction.channel.send({
          embeds: [infoEmbed(
          `Stream over! 配信が終わりました！`,
          `Please set another stream or move to another VC.\n他の配信を指定するか、他のVCに移動してください。`
        )]
      });
      if (pinMessage === null) {
        console.error('Tried to unpin a message that no longer exists.');
      } else if (pinMessage === undefined) {
        console.error('Tried to unpin an undefined message');
      } else {
        await pinMessage.unpin();
      }
    }
  } else {
    interaction.reply({ embeds: [errorEmbed('Unexpected Error')] });
    console.error(videoInfo);
  }
};

const watchForStreamEnd = async (url: string): Promise<void> => {
  const videoInfo = await youtube.videos.get(url);
  if (videoInfo.snippet.liveBroadcastContent === 'none') {
    return;
  } else {
    await sleep(10000);
    console.log(`watching: ${url}`);
    return watchForStreamEnd(url);
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
