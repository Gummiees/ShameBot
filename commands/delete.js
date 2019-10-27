const { RichEmbed } = require('discord.js');

const myDatabase = require('../database/database.js');

const myDatabaseInstance = new myDatabase();
const Tags = myDatabaseInstance.defineDatabase();

module.exports = {
  name: 'delete',
  cooldown: 2,
  description: `Deletes a ${global.categories.join(', ')}.`,
  async execute(message, client, args) {
    let embed = new RichEmbed();
    if (args.length > 0 && !isNaN(args[0])) {
      const rowCount = await Tags.destroy({ where: { id: parseInt(args[0]) } });
      if (!rowCount) {
        embed.setDescription("That ID doesn't exists.").setColor(0xc90a0a);
      } else {
        embed
          .setTitle(`Deleted!`)
          .setDescription(`the ${global.categories.join('/')} has been deleted.`)
          .setColor(0x0ac930);
      }
    } else if (args.length == 0) {
      embed
        .setTitle('Info')
        .setDescription(`!delete  _id of the ${global.categories.join('/')}_`)
        .setColor(0x0aa0c9);
    } else {
      embed.setDescription('The ID must be a number!').setColor(0xffc20d);
    }

    message.channel.send(embed);
  }
};
