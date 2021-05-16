const { Canvas } = require('canvas-constructor');
const data = [...Array(26)].map((_, y) => String.fromCharCode(y + 65));

const generateText = (n) => data.sort(() => Math.random() - Math.random()).map((x, i) => x + data[i+1] + data[i+2]).slice(0, n).join(' ');

const makeImage = async (baseImage, text) => {
    return new Canvas(1317, 655)
    .printImage(await baseImage, 0, 0, 1317, 655)
    .setTextFont('120px RobotoRegular')
    .setColor('#000000')
    .printText(text, 407, 475)
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
