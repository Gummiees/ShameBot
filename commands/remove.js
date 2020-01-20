const { RichEmbed } = require('discord.js');
const functions = require('../functions/functions');
const Item = require('../models/item');

const firstOptions = ['rule', 'points'];

module.exports = {
  name: 'remove',
  cooldown: 2,
  description: `Removes a rule or point.`,
  async execute(message, client, args) {
    let embed = new RichEmbed();
    try {
      if (args.length == 0) {
        embed.setDescription(`_remove [rule|points] [ID]`).setColor(0x0aa0c9);
        embed = await functions.setRandomLlamaImage(embed);
      } else if (args.length != 2 || !firstOptions.find(opt => opt == args[0]) || isNaN(args[1])) {
        // If there's only one arg or this one arg is not on the first options.
        embed = await functions.setEmbedIncorrect(embed, module.exports.name);
      } else {
        const id = parseInt(args[1]);
        if (args[0] == 'points') {
          // Remove counter
          await Item.findOneAndUpdate({ id: id }, { $inc: { counter: -1 } }, async (err, items) => {
            if (err) resolve(await functions.setEmbedError(embed, err));

            embed.setDescription(`Removed successfully.`).setColor(0x0ac930);
            embed = await functions.setRandomLlamaImage(embed);
          });
        } else {
          await Item.deleteOne({ id: id }, async err => {
            if (err) resolve(await functions.setEmbedError(embed, err));

            embed.setDescription(`Removed successfully.`).setColor(0x0ac930);
            embed = await functions.setRandomLlamaImage(embed);
          });
        }
      }
    } catch (err) {
      return await functions.setEmbedError(embed, err);
    }
    message.channel.send(embed);
  }
};
