//Este archivo contiene una función que carga todas las animaciones: 

export const createAnimations = (game) => {
    //Animación de caminar:
    //Para que las entidades usen las diferentes imagenes el sprite y genere animaciones, debemos utilizar un método de phaser llamado .anims.create(), tendrá como argumento un objeto: 
    game.anims.create({
        //Primero necesitamos un nombre key para identificar la animación.
        key: "mario-walk",
        //Luego en frames utilizamos el método .anims.generateFrameNumbers() y utilizamos el sprite de mario mediante su id. 
        frames: game.anims.generateFrameNumbers(
            'mario', //<-- id
            //Como ya hemos cargado el sprite y está dividido, simplemente necesitamos decirle con cuál empezará y con cual termina. Ver nota 5.
            {start: 3, end: 1}
        ),
        //Aquí estamos indicando a cuantos cuadros por segundo aparecerá la animación.
        frameRate: 12,
        //Podemos indicar cuantas veces se debe repetir la animación. Si el valor es -1, entonces será un loop infinito. 
        repeat: -1,
    });

    //Animación ideal: 
    game.anims.create({
        key:'mario-idle',
        frames:[{key:'mario', frame:0}]
    });

    //Animación de salto: 
    game.anims.create({
        key: "mario-jump",
        //Como solo necesitamos un frame, podemos colocarlo simplificadamente:
        frames: [{key: "mario", frame: 5}]
    });
    
    //Animación ideal - Mario grande: 
    game.anims.create({
        key:'mario-idle-grown',
        frames: [{key:'mario-grown', frame: 0}],
    });

    //Animación de caminar - Mario grande: 
    game.anims.create({
        key:'mario-walk-grown',
        frames: game.anims.generateFrameNumbers(
            'mario-grown',  {start: 3, end: 1},
        ),
        frameRate: 12,
        repeat:-1
    });

    //Animación de salto - Mario grande: 
    game.anims.create({
        key:'mario-jump-grown',
        frames: [{key: 'mario-grown', frame: 5}]
    });

    //Animación de agacharse - Mario grande:
    game.anims.create({
        key:'mario-crouch-grown',
        frames: [{key: 'mario-grown', frame: 4}]
    });

    //Animación de muerte:
    game.anims.create({
        key: "mario-dead",
        frames: [{key:"mario", frame: 4}]
    });

    //Animación de caminar - goomba:
    game.anims.create({
        key: 'goomba-walk',
        frames: [
            {key: "goomba", frame:0}, 
            {key: "goomba", frame:1}, 
        ],
        frameRate: 12,
        repeat: -1
    });

    //Animación de giro de monedas: 
    game.anims.create({
        key: 'coin-spin',
        frames: game.anims.generateFrameNumbers('coin', {start: 0, end: 3}),
        frameRate: 12,
        repeat: -1
    });
}