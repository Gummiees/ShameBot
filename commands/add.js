const { RichEmbed } = require('discord.js');
const functions = require('../functions/functions');
const Item = require('../models/item');

const firstOptions = ['rule', 'points'];

async function rule(args, embed) {
  return new Promise(async resolve => {
    if (args.length >= 3) {
      Item.find({}, async (err, items) => {
        if (err || !items) resolve(await functions.setEmbedError(embed, err));

        if (items.length == 0) resolve(await functions.setEmbedError(embed, err));

        items.sort((item1, item2) => {
          if (item1.id > item2.id) return -1;
          if (item1.id < item2.id) return 1;
          return 0;
        });

        const id = parseInt(items[0].id) + 1;
        const points = parseInt(args[1]);
        const name = args.splice(2).join(' ');

        const item = new Item({
          id: id,
          name: name,
          points: points,
          counter: 0
        });

        item.save(async err => {
          if (err) resolve(functions.setEmbedError(embed, err));

          embed.setDescription(`Added successfully.`).setColor(0x0ac930);
          embed = await functions.setRandomLlamaImage(embed);
          resolve(embed);
        });
      });
    } else {
      resolve(await functions.setEmbedIncorrect(embed, module.exports.name));
    }
  });
}

async function points(args, embed) {
  return new Promise(async resolve => {
    if (args.length == 2) {
      const id = parseInt(args[1]);
      Item.findOneAndUpdate({ id: id }, { $inc: { counter: 1 } }, async (err, items) => {
        if (err) resolve(await functions.setEmbedError(embed, err));

        embed.setDescription(`Added successfully.`).setColor(0x0ac930);
        embed = await functions.setRandomLlamaImage(embed);
        resolve(embed);
      });
    } else {
      resolve(await functions.setEmbedIncorrect(embed, module.exports.name));
    }
  });
}

module.exports = {
  name: 'add',
  cooldown: 2,
  description: `Adds a rule or point.`,
  async execute(message, client, args) {
    let embed = new RichEmbed();
    try {
      if (args.length == 0) {
        embed.setDescription(`!add [rule|points] [points|ID] [description]`).setColor(0x0aa0c9);
        embed = await functions.setRandomLlamaImage(embed);
      } else if (args.length < 2 || !firstOptions.find(opt => opt == args[0]) || isNaN(args[1])) {
        // If there's only one arg or this one arg is not on the first options.
        embed = await functions.setEmbedIncorrect(embed, module.exports.name);
      } else if (args[0] == 'points') {
        embed = await points(args, embed);
      } else {
        embed = await rule(args, embed);
      }
    } catch (err) {
      return await functions.setEmbedError(embed, err);
    }
    message.channel.send(embed);
  }
};
