import { errorEmbed, infoEmbed } from '../messages';
import { CommandInteraction, MessageReaction, User } from 'discord.js';
import { TwitterApi } from 'twitter-api-v2';
import dotenv from 'dotenv';

const { Message, MessageActionRow, MessageButton } = require('discord.js');
const twitter = require('twitter-text');

const client = require('../index');

dotenv.config();

const twitterClient = new TwitterApi({
  appKey: process.env.TWITTER_APP_KEY!,
  appSecret: process.env.TWITTER_APP_SECRET!,
  accessToken: process.env.TWITTER_ACCESS_TOKEN!,
  accessSecret: process.env.TWITTER_ACCESS_SECRET!,
});
const rwClient = twitterClient.readWrite;

let tweetText: string|null;
let row: typeof MessageActionRow;
let processingFlag: boolean;

function getMods() {
  const guild = client.guilds.cache.get(process.env.SERVER_ID);
  if (!guild) {
    console.error('Could not get the guild.');
    return;
  }
  if (process.env.MOD_ROLE_ID != null && process.env.ADMIN_ID != null && process.env.SELF_ID != null) {
    let mods = guild.members.cache.filter(
      (member: any) => member.roles.cache.find(
        (role: any) => role.id === process.env.MOD_ROLE_ID
      )
    ).map((member: any) => member.id);
    mods.push(process.env.ADMIN_ID);
    mods.push(process.env.SELF_ID);
    return mods;
  } else {
    console.error('MOD_ROLE_ID and/or ADMIN_ID are not defined.');
    return false;
  }
}

module.exports = {
  data: {
    name: 'tweet',
    description: 'Ask mods to approve your tweet. If a majority approve it, will be tweeted on our account.',
    options: [{
      type: 'STRING',
      name: 'tweet',
      description: 'Tweet. Maximum 140 full-width characters or 280 half-width characters.',
      required: true
    }]
  },

  async execute(interaction: CommandInteraction) {
    if (processingFlag) {
      interaction.reply({
        embeds: [errorEmbed('Waiting for approcal of another tweet. You can only send one tweet at a time. \n他のツイートが承認待ちです。ツイートは1つずつしか送信できません。')]
      });
      return;
    }

    tweetText = interaction.options.getString('tweet');
    if (tweetText === null) {
      interaction.reply({
        embeds: [errorEmbed('`tweet` slash command parameter is missing. This should not happen if the bot is properly configured.')]
      });
      return;
    }

    const tweetInfo = twitter.parseTweet(tweetText);
    if (tweetInfo.weightedLength > 280) {
      interaction.reply({
        embeds: [errorEmbed(`Your tweet is too long.\ntweet: ${tweetText}\nweightedLength: ${tweetInfo.weightedLength}`)]
      });
      return;
    }

    row = new MessageActionRow()
      .addComponents(
        new MessageButton()
          .setCustomId('tweet')
          .setLabel('Tweet it')
          .setStyle('PRIMARY'),
      );

    const mods = getMods();
    if (!mods) {
      interaction.reply({
        embeds: [errorEmbed('Could not get a moderators list.')]
      });
      return;
    }

    console.log(`The tweet is pending approval. Approvable Mods: ${mods}`);
    console.log(`Number of approvals required: ${mods.length / 2}`);
    const messageReply = (
      await interaction.reply({
        embeds: [infoEmbed(
          'Your tweet is pending approval. ツイートは承認待ちです。',
          `Please wait for approval by moderators. モデレータの承認をお待ち下さい。 \nTweet: ${tweetText}`,
        )],
        fetchReply: true
      })
    ) as typeof Message;

    messageReply.react('👍');
    processingFlag = true;

    const filter = (reaction: MessageReaction, user: User) => {
      if (reaction.emoji.name !== null) {
        return reaction.emoji.name === '👍' && mods.includes(user.id);
      } else {
        return false;
      }
    };

    messageReply.awaitReactions({ filter, maxUsers: (mods.length / 2), errors: ['time'] }) //
      //.then((collected: any) => {
      //  const reaction = collected.first();
      //  console.log(reaction);
      .then(() => {
        interaction.followUp({
          embeds: [infoEmbed(
            'Your tweet has been approved. ツイートは承認されました。',
            `Tweet it? ツイートしますか？\nTweet: ${tweetText}`,
          )],
          components: [row],
        });
      })
      .catch(() => {
        console.log('awaitReactions timeout');
      });
  },
};

client.on('messageReactionAdd', async (reaction: MessageReaction, user: User) => {
  const mods = getMods();
  if (!mods) {
    return;
  }
  // By comparing the two, check whether the emoji is reacted to the desired interaction.
  // Not necessary now but maybe useful in the future
  //if (reaction.message.interaction != null) {
  //  console.log(reaction.message.interaction.id);
  //  console.log(interaction.id);
  //}
  if (reaction.message.author != null) {
    if (!mods.includes(user.id) && reaction.me) {
      console.log(`${user.username} reacted with "${reaction.emoji.name}", but removed because they are not a mod.`);
      reaction.users.remove(user.id);
    } else if (reaction.me) {
      console.log(`${user.username} reacted with "${reaction.emoji.name}".`);
    }
  }
});

//client.on('messageReactionRemove', async (reaction: MessageReaction, user: User) => {
//  console.log(`${user.username} removed their "${reaction.emoji.name}" reaction.`);
//});

client.on('interactionCreate', async (interaction: CommandInteraction) => {
  if (!interaction.isButton()) {
    return;
  }
  if (interaction.channel === null) {
    await interaction.reply({
      embeds: [errorEmbed('Tried to get a message for a channel that no longer exists.')],
    });
    console.error('Tried to get a message for a channel that no longer exists.');
  } else if (interaction.customId === 'tweet' && tweetText !== null) {

    await rwClient.v1.tweet(tweetText);
    interaction.update({ components: [] });

    await interaction.channel.send({
      embeds: [infoEmbed('Tweeted! ツイートしました！', tweetText)],
    });

    processingFlag = false;
  }

});
