module.exports = {
  name: 'help',
  cooldown: 5,
  description: 'Shows all the possible commands',
  execute(message) {
    return message.channel.send('No help for at the moment!');
  }
};
