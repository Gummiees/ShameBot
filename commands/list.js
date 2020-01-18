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
      await Item.find({}, async (err, items) => {
        if (err || !items || items.length == 0) resolve(await functions.setEmbedError(embed, err || 'no items found.'));

        items.sort((item1, item2) => {
          if (item1.points > item2.points) return 1;
          if (item1.points < item2.points) return -1;
          if (item1.id > item2.id) return 1;
          if (item1.id < item2.id) return -1;
          return 0;
        });

        let lastItem = null;
        let description = '';
        items.forEach(item => {
          if (!lastItem || lastItem.points != item.points) {
            if (lastItem) {
              description += `\n`;
            }
            description += `**${item.points} POINTS**\n`;
          }
          description += `${item.id}. ${item.name}\n`;
          lastItem = item;
        });

        embed
          .setTitle('List of rules (ID. Description)')
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
