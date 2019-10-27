const { RichEmbed } = require('discord.js');
const moment = require('moment');

const myDatabase = require('../database/database.js');

const myDatabaseInstance = new myDatabase();
const Tags = myDatabaseInstance.defineDatabase();

module.exports = {
  name: 'add',
  cooldown: 2,
  description: `Adds a ${global.categories.join(', ')}.`,
  async execute(message, client, args) {
    let embed = new RichEmbed();
    try {
      if (args.length == 0) {
        embed
          .setTitle('Info')
          .setDescription(`!add  _id of the ${global.categories.join('/')}_ _needs more info!_`)
          .setColor(0x0aa0c9);
      } else if (isNaN(args[0])) {
        embed
          .setTitle('Not a number')
          .setDescription(`The first argument must be a number!`)
          .setColor(0xffc20d);
      } else if (args.length == 1) {
        // add counterr !add 1
        const tag = await Tags.findOne({ where: { id: parseInt(args[0]) } });
        if (tag) {
          await Tags.update({ duration: null, counter: tag.counter + 1 }, { where: { id: parseInt(args[0]) } });
          embed.setDescription(`Added one correctly.`).setColor(0x0ac930);
        } else {
          embed
            .setTitle('Not found')
            .setDescription(`Could not find a tag with the ID '${args[0]}'`)
            .setColor(0xffc20d);
        }
      } else if (isNaN(args[1])) {
        embed
          .setTitle('Not a number')
          .setDescription(`The second argument must be a number!`)
          .setColor(0xffc20d);
      } else {
        if (args.length == 2) {
          // add counter !add 1 2
          const id = parseInt(args[0]);
          const counts = parseInt(args[1]);
          const tag = await Tags.findOne({ where: { id: id } });
          if (tag) {
            await Tags.update({ duration: null, counter: tag.counter + counts }, { where: { id: id } });
            embed.setDescription(`Added ${counts} correctly.`).setColor(0x0ac930);
          } else {
            embed
              .setTitle('Not found')
              .setDescription(`Could not find a tag with the ID '${args[0]}'`)
              .setColor(0xffc20d);
          }
        } else if (args.length == 3) {
          // add timer !add 1 2 days
          const id = parseInt(args[0]);
          const number = parseInt(args[1]);
          const tag = await Tags.findOne({ where: { id: id } });
          let date;
          if (tag) {
            if (tag.duration) {
              // add to the one that already exists
              date = moment(tag.duration).add(number, args[2]);
            } else {
              // create a new one
              date = moment().add(moment.duration(number, args[2]).asMilliseconds());
            }
            await Tags.update({ duration: date, counter: 0 }, { where: { id: id } });
            embed.setDescription(`Added ${number} ${args[2]} correctly.`).setColor(0x0ac930);
          } else {
            embed
              .setTitle('Not found')
              .setDescription(`Could not find a tag with the ID '${args[0]}'`)
              .setColor(0xffc20d);
          }
        } else {
          embed.setDescription(`Too many arguments!`).setColor(0xffc20d);
        }
      }
    } catch (e) {
      embed
        .setTitle('Error')
        .setDescription(`Something went wrong. ${JSON.stringify(e)}`)
        .setColor(0xc90a0a);
    }

    message.channel.send(embed);
  }
};
