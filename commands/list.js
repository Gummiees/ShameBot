const { RichEmbed } = require('discord.js');
const moment = require('moment');

const myDatabase = require('../database/database.js');

const myDatabaseInstance = new myDatabase();
const Tags = myDatabaseInstance.defineDatabase();

module.exports = {
  name: 'list',
  cooldown: 2,
  description: `List all the ${global.categories.join(', ')}.`,
  async execute(message, client, args) {
    let embed = new RichEmbed();
    try {
      if (args && args.length == 1) {
        if (global.categories.includes(args[0])) {
          const tagList = await Tags.findAll({
            where: {
              category: args[0]
            },
            order: [['id', 'ASC']],
            attributes: ['id', 'name', 'duration', 'counter']
          });
          const tagString =
            tagList
              .map(t => {
                if (t.duration && moment(t.duration).isAfter(new Date())) {
                  updateMoment();
                  return `${tag.id}. ${tag.name} - ${moment().to(tag.duration)}`;
                }
                return `${tag.id}. ${tag.name} - ${tag.counter}`;
              })
              .join('\n') || `There are no ${args[0]}s.`;
          embed
            .setTitle(`List of ${args[0]}`)
            .setDescription(tagString)
            .setColor(0x0ac930);
        } else {
          embed
            .setTitle('Wrong category')
            .setDescription(`The catergory must be one of these: ${global.categories.join(', ')}.`)
            .setColor(0xffc20d);
        }
      } else if (args && args.length > 1) {
        embed
          .setTitle('Multiple categories')
          .setDescription(`You can only filter the list by one category!`)
          .setColor(0xffc20d);
      } else {
        const tagList = await Tags.findAll({ order: [['id', 'ASC']], attributes: ['id', 'name', 'category', 'duration', 'counter'] });

        embed.setTitle(`List of ${global.categories.join('/')}`).setColor(0x0ac930);

        const tagListByCategory = {};

        tagList.forEach(tag => {
          if (!tagListByCategory[tag.category]) {
            tagListByCategory[tag.category] = [];
          }
          if (tag.duration && moment(tag.duration).isAfter(new Date())) {
            updateMoment();
            tagListByCategory[tag.category].push(`${tag.id}. ${tag.name} - ${moment().to(tag.duration)}`);
          } else {
            tagListByCategory[tag.category].push(`${tag.id}. ${tag.name} - ${tag.counter}`);
          }
        });

        Object.keys(tagListByCategory).forEach(key => {
          embed.addField(key, tagListByCategory[key].join('\n'));
        });
      }
    } catch (e) {
      embed
        .setTitle(`Error`)
        .setDescription(`There was an error listing the results: ${JSON.stringify(e)}`)
        .setColor(0xc90a0a);
    }

    message.channel.send(embed);
  }
};

function updateMoment() {
  moment.updateLocale('en', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 'a few seconds',
      ss: '%d seconds',
      m: 'a minute',
      mm: '%d minutes',
      h: 'an hour',
      hh: '%d hours',
      d: 'a day',
      dd: '%d days',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years'
    }
  });
  moment.updateLocale('es', {
    relativeTime: {
      future: 'in %s',
      past: '%s ago',
      s: 'a few seconds',
      ss: '%d seconds',
      m: 'a minute',
      mm: '%d minutes',
      h: 'an hour',
      hh: '%d hours',
      d: 'a day',
      dd: '%d days',
      M: 'a month',
      MM: '%d months',
      y: 'a year',
      yy: '%d years'
    }
  });
}
