const { RichEmbed } = require('discord.js');
const functions = require('../functions/functions');
const Item = require('../models/item');

module.exports = {
  name: 'list',
  cooldown: 2,
  description: `List the rules.`,
  async execute(message, client, args) {
    let embed = new RichEmbed();
    try {
      Item.find({}, async (err, items) => {
        if (err || !items || items.length == 0) resolve(await functions.setEmbedError(embed, err));

        items.sort((item1, item2) => {
          if (item1.id > item2.id) return -1;
          if (item1.id < item2.id) return 1;
          return 0;
        });

        let description = items.map(item => `${item.id}- ${item.name} - ${item.points}`).join('\n');
        embed
          .setTitle('List of rules')
          .setDescription(description)
          .setColor(0x0aa0c9);
        embed = await functions.setRandomLlamaImage(embed);
      });
    } catch (err) {
      return await functions.setEmbedError(embed, err);
    }
    message.channel.send(embed);
  }
};
