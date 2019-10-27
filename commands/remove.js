const { RichEmbed } = require('discord.js');
const moment = require('moment');

const myDatabase = require('../database/database.js');

const myDatabaseInstance = new myDatabase();
const Tags = myDatabaseInstance.defineDatabase();

module.exports = {
  name: 'remove',
  cooldown: 2,
  description: `Removes a ${global.categories.join(', ')}.`,
  async execute(message, client, args) {
    let embed = new RichEmbed();
    if (isNaN(args[0])) {
      embed.setDescription(`The ID must be a number!`).setColor(0xffc20d);
    } else if (args.length == 1) {
      try {
        const tag = await Tags.findOne({ where: { id: parseInt(args[0]) } });
        if (tag) {
          if (tag.counter > 0) {
            await Tags.update({ duration: tag.duration, counter: tag.counter - 1 }, { where: { id: args[0] } });
            embed.setDescription(`Removed correctly.`).setColor(0x0ac930);
          } else {
            embed
              .setTitle("Can't remove")
              .setDescription(`The counter for the ID '${args[0]}' is already 0.`)
              .setColor(0xffc20d);
          }
        } else {
          embed
            .setTitle('Not found')
            .setDescription(`Could not find a ${global.categories.join('/')} with the ID '${args[0]}'`)
            .setColor(0xffc20d);
        }
      } catch (e) {
        embed
          .setTitle('Error')
          .setDescription(`Something went wrong with adding a tag. ${JSON.stringify(e)}`)
          .setColor(0xc90a0a);
      }
    } else if (args.length > 3) {
      embed
        .setTitle('Too many args')
        .setDescription('You only need to provide the ID!')
        .setColor(0xffc20d);
    } else if (args.length == 0) {
      embed
        .setTitle('Info')
        .setDescription(`!remove _ID of the ${global.categories.join('/')}_`)
        .setColor(0x0aa0c9);
    } else if (isNaN(args[1])) {
      embed
        .setTitle('Not a number')
        .setDescription(`The second argument must be a number!`)
        .setColor(0xffc20d);
    } else {
      if (args.length == 2) {
        // !remove 1 2
        const id = parseInt(args[0]);
        const counts = parseInt(args[1]);
        const tag = await Tags.findOne({ where: { id: id } });
        if (tag) {
          if (tag.counter > 0) {
            await Tags.update({ duration: null, counter: tag.counter - counts }, { where: { id: id } });
            embed.setDescription(`Removed ${counts} correctly.`).setColor(0x0ac930);
          } else {
            embed
              .setTitle("Can't remove")
              .setDescription(`The counter for the ID '${args[0]}' is already 0.`)
              .setColor(0xffc20d);
          }
        } else {
          embed
            .setTitle('Not found')
            .setDescription(`Could not find a tag with the ID '${args[0]}'`)
            .setColor(0xffc20d);
        }
      } else {
        // !remove 1 2 days
        const id = parseInt(args[0]);
        const number = parseInt(args[1]);
        const tag = await Tags.findOne({ where: { id: id } });
        if (tag && tag.duration) {
          // subtracts to the one that already exists
          const date = moment(tag.duration).subtract(number, args[2]);
          if (date.isAfter(new Date())) {
            await Tags.update({ duration: date, counter: 0 }, { where: { id: id } });
            embed.setDescription(`Removed ${number} ${args[2]} correctly.`).setColor(0x0ac930);
          } else {
            embed.setDescription('The duration has already passed!').setColor(0xffc20d);
          }
        } else if (tag) {
          embed.setDescription("There's no duration to substract from!").setColor(0xffc20d);
        } else {
          embed
            .setTitle('Not found')
            .setDescription(`Could not find a tag with the ID '${args[0]}'`)
            .setColor(0xffc20d);
        }
      }
    }

    message.channel.send(embed);
  }
};
