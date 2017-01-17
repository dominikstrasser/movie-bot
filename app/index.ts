
import { WitController } from './wit';
const witCtrl = new WitController();

const Botkit = require('botkit');

const botController = Botkit.slackbot({
  debug: false
});

const SLACK_TOKEN = process.env.SLACK_TOKEN;

botController.spawn({
  token: SLACK_TOKEN,
}).startRTM()


botController.hears('', ['direct_message', 'direct_mention', 'mention'], function (bot, message) {
  const text = message.text;
  const userId = message.user;
  witCtrl.sendMessage(text, userId, (replyText) => {
    bot.reply(message, replyText);
  });

});



