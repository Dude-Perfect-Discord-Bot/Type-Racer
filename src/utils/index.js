const fs = require('fs');
const { Canvas } = require('canvas-constructor');
const data = fs.readFileSync('./src/utils/words.txt', 'utf-8').trim().split('\n').filter(Boolean);

const generateText = (n) => data.sort(() => Math.random() - Math.random()).slice(0, n).join(' ');

const makeImage = async (baseImage, text) => {
    return new Canvas(1317, 655)
    .printImage(await baseImage, 0, 0, 1317, 655)
    .setColor('#000000')
    .setTextSize(125)
    .printText(text, 435, 465)
    .save()
    .toBuffer();
}

const ordinal = (number) => {
    const pr = new Intl.PluralRules('en', {
        type: 'ordinal',
    });
    const suffixes = new Map([
        ['one', 'st'],
        ['two', 'nd'],
        ['few', 'rd'],
        ['other', 'th'],
    ]);
    const rule = pr.select(number);
    const suffix = suffixes.get(rule);
    return `${number}${suffix}`;
}


module.exports = {
    generateText,
    makeImage,
    ordinal,
}
