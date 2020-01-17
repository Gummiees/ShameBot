const { Client, Collection } = require('discord.js');
const { prefix } = require('./config.json');
const fs = require('fs');
const mongoose = require('mongoose');
const http = require('http');
const fetch = require('node-fetch');
global.fetch = fetch;

const token = process.env.token;
const MONGODB_URI = process.env.MONGODB_URI;

http
  .createServer((req, res) => {
    res.writeHead(200, {
      'Content-type': 'text/plain'
    });
    res.write('Hey');
    res.end();
  })
  .listen(4000);

// DATABASE STUFF
mongoose.connect(MONGODB_URI);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// DISCORD STUFF
const client = new Client();
const cooldowns = new Collection();
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

db.once('open', () => {
  client.on('message', message => {
    commands(message);
  });

  function commands(message) {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift().toLowerCase();

    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return message.reply(`No command was found for \`${commandName}.\``);

    if (!cooldowns.has(command.name)) {
      cooldowns.set(command.name, new Collection());
    }

    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;

    if (timestamps.has(message.author.id)) {
      const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

      if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
      }
    } else {
      timestamps.set(message.author.id, now);
      setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
    }

    try {
      command.execute(message, client, args);

      if (command.args && !args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
      }
    } catch (e) {
      message.reply(`there was an error trying to execute that command! ${JSON.stringify(e)}`);
    }
  }

  client.login(token);
});
