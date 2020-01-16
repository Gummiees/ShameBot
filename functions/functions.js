module.exports = {
  setEmbedIncorrect: function(embed, commandName) {
    return embed
      .setTitle('Not correct')
      .setDescription(`The command is not correct! Type \`!${commandName}\` or \`!help\`.`)
      .setColor(0xffc20d);
  },
  setEmbedError: function(embed, err) {
    embed
      .setTitle('Error')
      .setDescription(`Something went wrong. ${JSON.stringify(err)}`)
      .setColor(0xc90a0a);
  }
};
