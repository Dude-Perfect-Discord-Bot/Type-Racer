const { Client, MessageAttachment, MessageCollector, MessageEmbed, Constants: { Events } } = require('discord.js');
const { loadImage } = require('canvas');
const { strictEqual }= require('assert');
const { Stopwatch } = require('@sapphire/stopwatch');
const { makeImage, generateText } = require('./utils');

const client = new Client();
 
const PREFIX = '>';
const TOKEN = '';

client.on(Events.CLIENT_READY, async () => {
    console.log(`${client.user?.username} Ready!`);
    client.IMAGE = loadImage('./src/assets/Typo.png');    
});

client.on(Events.MESSAGE_CREATE, async (message) => {
    if (message.channel.type !== 'text' || !message.guild || message.author.bot) return;

    if (!message.content.startsWith(PREFIX)) return;
    const args = message.content.slice(PREFIX.length).trim().split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd === 'race') {

        const data = [];
        const text = generateText(3);
        const attachment = new MessageAttachment(await makeImage(client.IMAGE, text));
        const embed = new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(message.guild?.name, message.guild?.iconURL({ dynamic: true, format: 'png', size: 4096 }))
        .setFooter(client.user?.username, client.user?.displayAvatarURL())
        .setTimestamp()
        message.channel.send(attachment);

        const stopwatch = new Stopwatch();
        const collector = new MessageCollector(message.channel, m => !m.author.bot, {
            time: 10000,
        });
        collector.on('collect', (msg) => {
            if (strictEqual(text, msg.content) === undefined) {
                msg.react('✅');
                data.push({ name: msg.author.username, value: `\`${stopwatch.stop().toString()}\`` });
            }
        })

        collector.on('end', () => {
            if (data.length) {
                embed.addFields(data.sort((a, b) => a.value - b.value));
            message.channel.send('Time up, The results are!', { embed: embed });
            }
            else
            message.channel.send('Time up! No one entered the race');
        })

    }

});

client.login(TOKEN);
