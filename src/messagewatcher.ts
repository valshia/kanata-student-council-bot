const { Message, MessageEmbed } = require('discord.js');
import { infoEmbed } from './messages';

const { blacklist } = require('./blacklist');

export const eventName = 'messageCreate';
export async function event(message: typeof Message) {
  if (message.embeds == null) {
    return;
  }
  message.embeds.forEach((embed: typeof MessageEmbed) => {
    if (embed.author == null) {
      return;
    } else {
      for (let index = 0; index < blacklist.length; index++) {
        const reg = new RegExp(blacklist[index].id);
        if (embed.author.url.match(reg)) {
          console.log(`${message.author.username} posted the backlisted videos.`);
          console.log(embed.title);
          console.log(embed.author);
          message.channel.send({
            embeds: [infoEmbed(
              'Blacklisted channel',
              `Since that YouTube channel is blacklisted, please do not share it.\n` +
              `そのYouTubeチャンネルはブラックリストに登録されていますので、共有しないでください。`
            )],
          });
          message.delete();
          return;
        }
      }
    }
  });
}
