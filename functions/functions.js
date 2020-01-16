module.exports = {
  setEmbedIncorrect: function(embed, commandName) {
    return embed.setDescription(`The command is not correct! Type \`!${commandName}\` or \`!help\`.`).setColor(0xffc20d);
  },
  setEmbedError: function(embed, err) {
    embed
      .setTitle('Oops! Something went wrong.')
      .setDescription(`${JSON.stringify(err)}`)
      .setColor(0xc90a0a);
  }
};
