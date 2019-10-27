const { RichEmbed } = require('discord.js');
const myFunctions = require('../functions/functions.js');

module.exports = {
  name: 'avatar',
  cooldown: 15,
  aliases: ['icon', 'pfp'],
  description: 'Look for the avatar of a user',
  execute(message, client, args) {
    const embed = new RichEmbed();
    let user = message.author;
    if (args[0]) {
      user = myFunctions(client, args[0]);
      if (!user) {
        return message.reply("Please use a proper mention if you want to see someone else's avatar.");
      }
    }
    embed
      .setTitle(`${user.username}'s avatar`)
      .setImage(user.displayAvatarURL)
      .setColor(0x0ac930);
    message.channel.send(embed);
  }
};
