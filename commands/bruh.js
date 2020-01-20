const { RichEmbed } = require('discord.js');

module.exports = {
  name: 'bruh',
  cooldown: 2,
  description: `b r u h`,
  async execute(message, client, args) {
    let embed = new RichEmbed();
    try {
      embed.setImage(`https://imgur.com/a/NCivMdo`);
    } catch (err) {
      return await functions.setEmbedError(embed, err);
    }
    message.channel.send(embed);
  }
};
