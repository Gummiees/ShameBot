const Unsplash = require('unsplash-js').default;
const UNSPLASH_ACCESS_KEY = process.env.unsplash_access;

module.exports = {
  async setEmbedIncorrect(embed, commandName) {
    embed.setDescription(`The command is not correct! Type \`!${commandName}\` or \`!help\`.`).setColor(0xffc20d);

    return await module.exports.setRandomLlamaImage(embed);
  },
  async setEmbedError(embed, err) {
    embed
      .setTitle('Oops! Something went wrong.')
      .setDescription(`${JSON.stringify(err)}`)
      .setColor(0xc90a0a);

    return await module.exports.setRandomLlamaImage(embed);
  },
  async setRandomLlamaImage(embed) {
    // IMAGE API STUFF
    const unsplash = new Unsplash({ accessKey: UNSPLASH_ACCESS_KEY });
    unsplash.users.profile('naoufal').catch(err => console.error.bind(console, 'unsplash connection error:'));

    jsonImage = await unsplash.photos.getRandomPhoto({ query: 'llama', orientation: 'squarish' }).then(toJson);
    return embed.setImage(jsonImage.urls.thumb);
  }
};
