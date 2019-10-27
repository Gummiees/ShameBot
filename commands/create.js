const { RichEmbed } = require('discord.js');

const myDatabase = require('../database/database.js');

const myDatabaseInstance = new myDatabase();
const Tags = myDatabaseInstance.defineDatabase();

module.exports = {
  name: 'create',
  cooldown: 2,
  description: `Creates a ${global.categories.join(', ')} to keep track of.`,
  async execute(message, client, args) {
    let embed = new RichEmbed();
    if (args.length > 1) {
      if (global.categories.includes(args[0])) {
        try {
          const tag = await Tags.create({
            name: args.slice(1, args.length).join(' '),
            category: args[0]
          });
          embed
            .setTitle(`Created a ${tag.category}`)
            .setDescription(`${tag.id} - ${tag.name}`)
            .setColor(0x0ac930);
        } catch (e) {
          if (e.name === 'SequelizeUniqueConstraintError') {
            embed.setDescription('That tag already exists.').setColor(0xc90a0a);
          } else {
            embed
              .setTitle('Error')
              .setDescription(`Something went wrong with adding a tag. ${JSON.stringify(e)}`)
              .setColor(0xc90a0a);
          }
        }
      } else {
        embed
          .setTitle('Wrong category')
          .setDescription(`The catergory must be one of these: ${global.categories.join(', ')}.`)
          .setColor(0xffc20d);
      }
    } else if (args.length > 0) {
      embed
        .setTitle('Not enough args')
        .setDescription('You need to provide the name and the category!')
        .setColor(0xffc20d);
    } else {
      embed
        .setTitle('Info')
        .setDescription(`!create  _name of the category (${global.categories.join('/')})_ _name of the ${global.categories.join('/')}_`)
        .setColor(0x0aa0c9);
    }

    message.channel.send(embed);
  }
};
