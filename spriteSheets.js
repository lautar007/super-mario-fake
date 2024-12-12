//Este archivo carga las sprite sheets:
const INIT_SPRITESHEETS = [
    //Mario: 
    {
        key: "mario",
        path: '/assets/entities/mario.png',
        frameWidth: 18,
        frameHeight: 16
    },
    {
        key: "goomba",
        path: '/assets/entities/overworld/goomba.png',
        frameWidth: 16,
        frameHeight: 16
    },
    {
        key: "coin",
        path: '/assets/collectibles/coin.png',
        frameWidth: 16,
        frameHeight: 16
    },
    {
        key: "mario-grown",
        path: '/assets/entities/mario-grown.png',
        frameWidth: 18,
        frameHeight: 32
    },
    {
        key: "block-stones",
        path: 'assets/blocks/overworld/brick-debris.png',
        frameWidth: 8,
        frameHeight: 8
    }
];

export function initSpriteSheets (load){
    INIT_SPRITESHEETS.forEach(({key, path, frameWidth, frameHeight}) => load.spritesheet(key, path, {frameWidth, frameHeight}));
}