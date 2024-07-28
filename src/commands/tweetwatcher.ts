import { errorEmbed, infoEmbed } from '../messages';
import { TwitterApi, ETwitterStreamEvent } from 'twitter-api-v2';
import { CommandInteraction } from 'discord.js';

const twitterClient = new TwitterApi(process.env.TWITTER_BEARER_TOKEN!);

module.exports = {
  data: {
    name: 'tweetwatcher',
    description: 'Relay tweets with specified user (WIP)',
    options: [{
      type: 'STRING',
      name: 'id',
      description: 'Twitter account id.',
      required: true
    }]
  },

  async execute(interaction: CommandInteraction) {
    const twitterId = interaction.options.getString('id');
    if (twitterId === null) {
      interaction.reply({
        embeds: [errorEmbed('`id` slash command parameter is missing. This should not happen if the bot is properly configured.')]
      });
      return;
    }

    // Get and delete old rules if needed
    const rules = await twitterClient.v2.streamRules();
    console.log(rules);
    if (rules.data?.length) {
      await twitterClient.v2.updateStreamRules({
        delete: { ids: rules.data.map((rule: any) => rule.id) },
      });
    }

    await twitterClient.v2.updateStreamRules({
      add: [{value: `from:${twitterId}`}],
    });

    let stream;
    try {
      stream = await twitterClient.v2.searchStream({
        'tweet.fields': ['referenced_tweets', 'author_id'],
        expansions: ['referenced_tweets.id'],
      });

      await interaction.reply({
        embeds: [infoEmbed(
          `Watching: ${twitterId}`,
          `I will relay the tweets from this account: ${twitterId} このアカウントのツイートを拾って投稿します。`,
        )],
        fetchReply: true
      });
    } catch (error) {
      console.log(error);
      await interaction.reply({
        embeds: [infoEmbed(
          `Changed watching account: ${twitterId}`,
          `I will relay the tweets from this account: ${twitterId} このアカウントのツイートを拾って投稿します。`,
        )],
        fetchReply: true
      });
    }

    try {
      if (stream != null) {
        stream.on(ETwitterStreamEvent.Data, async (tweet: any) => {
          const tweetUrl = `https://twitter.com/` + twitterId + `/status/` + tweet.data.id;
          if (interaction.channel === null) {
            console.error('Tried to send a message for a channel that no longer exists.');
          } else {
            await interaction.channel.send(`New tweet from ${twitterId}: ` + tweetUrl);
            console.log('New Tweet');
            console.log(tweet.data);
          }
        });
      }
    } catch (error) {
      console.error('Tweetwatcher Error');
      console.error(error);
    }
  },
};
