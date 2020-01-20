const { Attachment } = require('discord.js');

module.exports = {
  name: 'bruh',
  cooldown: 2,
  description: `b r u h`,
  async execute(message, client, args) {
    const attachment = new Attachment('https://i.imgur.com/FkZf3Or.png');
    message.channel.send(null, attachment);
  }
};
