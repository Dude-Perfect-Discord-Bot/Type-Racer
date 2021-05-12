const { Client, MessageAttachment, MessageCollector, MessageEmbed, Constants: { Events } } = require('discord.js');
const { loadImage } = require('canvas');
const { strictEqual }= require('assert');
const { Stopwatch } = require('@sapphire/stopwatch');
const { makeImage, generateText, ordinal } = require('./utils');
require('./extensions/TextChannel');
const client = new Client();

const PLACES = {
    1: '🥇',
    2: '🥈',
    3: '🥉',
}

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
        // we check if race is running
        if (message.channel.typeracestate !== 0) return message.channel.send('Type race is already running!');
        const data = [];
        const text = generateText(3);
        // set the state to 1, because race as started
        message.channel.setTypeRaceState(1);
        const attachment = new MessageAttachment(await makeImage(client.IMAGE, text));
        const embed = new MessageEmbed()
        .setColor('GREEN')
        .setAuthor(message.guild?.name, message.guild?.iconURL({ dynamic: true, format: 'png' }))
        .setFooter(client.user?.username, client.user?.displayAvatarURL())
        .setTimestamp()
        message.channel.send(attachment);

        const stopwatch = new Stopwatch(3);
        const collector = new MessageCollector(message.channel, m => !m.author.bot, {
            time: 10000,
        });
        collector.on('collect', (msg) => {
            if (strictEqual(text, msg.content.toLowerCase()) === undefined) {
                msg.react('✅');
                data.push({
                    name: msg.member?.displayName,
                    value: stopwatch.stop().toString()
                });
                // start stopwatch again.
	            stopwatch.start();
            }
        })

        collector.on('end', () => {
            if (data.length) {
                embed.addFields(data.sort((a, b) => a.value - b.value).map(({ name, value }, i) => {
                    return { 
                        name: `${PLACES[i + 1]}` ? `${PLACES[i + 1]} ${name}` : `${ordinal(i+1)} place ${name}`,
                        value: `\`${value}\``,
                    }
                }));
            message.channel.send('Time up, The results are!', { embed: embed });
            }
            else {
            message.channel.send('Time up! No one entered the race');
            }
            // we finish the race so set the state back to 0.
            message.channel.setTypeRaceState(0);
        });

    }

});

client.login(TOKEN);