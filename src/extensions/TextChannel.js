const { Structures } = require('discord.js');

class TypeRacerTextChannel extends Structures.get('TextChannel') {
    constructor(...args) {
        super(...args);
        this.typeracestate = 0;
    };

    setTypeRaceState(state) {
        this.typeracestate = state;
    }
}

Structures.extend('TextChannel', () => TypeRacerTextChannel);