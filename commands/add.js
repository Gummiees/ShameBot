const { RichEmbed } = require('discord.js');
const functions = require('../functions/functions');
const Item = require('../models/item');

const firstOptions = ['rule', 'points'];

module.exports = {
  name: 'add',
  cooldown: 2,
  description: `Adds a rule or point.`,
  async rule(args) {
    return new Promise(resolve => {
      if (args.length >= 3) {
        Item.find({}, (err, items) => {
          if (err) resolve(functions.setEmbedError(embed, err));

          items.sort((item1, item2) => {
            if (item1.id > item2.id) return -1;
            if (item1.id < item2.id) return 1;
            return 0;
          });

          const id = items[0].id + 1;
          const points = parseInt(args[1]);
          const name = Array(args)
            .slice(2)
            .join(' ');

          const item = new Item({
            id: id,
            name: name,
            points: points,
            counter: 0
          });

          item.save(err => {
            if (err) resolve(functions.setEmbedError(embed, err));
            resolve(embed.setDescription(`Added successfully.`).setColor(0x0ac930));
          });
        });
      } else {
        resolve(functions.setEmbedIncorrect(embed, module.exports.name));
      }
    });
  },
  async points(args) {
    return new Promise(resolve => {
      if (args.length == 2) {
        const id = parseInt(args[1]);
        Item.findOneAndUpdate({ id: id }, { $inc: { counter: 1 } }, (err, items) => {
          if (err) resolve(functions.setEmbedError(embed, err));
          resolve(embed.setDescription(`Added successfully.`).setColor(0x0ac930));
        });
      } else {
        resolve(functions.setEmbedIncorrect(embed, module.exports.name));
      }
    });
  },
  async execute(message, client, args) {
    let embed = new RichEmbed();
    try {
      if (args.length == 0) {
        embed.setDescription(`!add [rule|points] [points|ID] [description]`).setColor(0x0aa0c9);
      } else if (args.length < 2 || !firstOptions.find(opt => opt == args[0]) || isNaN(args[1])) {
        // If there's only one arg or this one arg is not on the first options.
        embed = functions.setEmbedIncorrect(embed, module.exports.name);
      } else if (args[0] == 'points') {
        embed = await module.exports.points(args);
      } else {
        embed = await module.exports.rule(args);
      }
    } catch (err) {
      return functions.setEmbedError(embed, err);
    }

    message.channel.send(embed);
  }
};
