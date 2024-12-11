//Este archivo carga los audios. 
//Ver nota 9.

const INIT_AUDIOS = [
    {
        key:'gameOver',
        path: '/assets/sound/music/gameover.mp3'
    },
    {
        key:'stomp',
        path: '/assets/sound/effects/goomba-stomp.wav'
    },
    {
        key: 'catchCoin',
        path: '/assets/sound/effects/coin.mp3'
    },
    {
        key:'powerUp',
        path:'/assets/sound/effects/consume-powerup.mp3'
    }
]

export function initAudio (load){
    INIT_AUDIOS.forEach(a => load.audio(a.key, a.path));
}