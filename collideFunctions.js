//Funciones de colisión: 

//Colisión con enemigo (ver nota 10).
export function onHitEnemy(mario, enemy){
    //Si Mario ya esta muerto, no lo podemos volver a matar... 
    if(mario.isDead) return;
    console.log(enemy.body.touching);
    //Golpe mortal: Para matar a un enemigo, Mario debe caer encima de él. Por lo que, en un condicional, nos aseguramos de que Mario esté tocando por abajo a la vez que el enemigo está tocando por arriba:
    //Nombre del tipo de enemigo: console.log(enemy.texture.key);
    if(mario.body.touching.down && enemy.body.touching.up){
        //Detenemos al enemigo:
        enemy.setVelocityX(0);
        //Sonido al aplastar:
        this.sound.add('stomp', {volume:2}).play();
        //El enemigo ya no camina, es aplastado:
        //(cambiar el frame según corresponda al tipo de enemigo)
        enemy.anims.stop();
        enemy.setFrame(2);
        //Pequeño salto de Mario:
        mario.setVelocityY(-200);

        //Ver el puntaje al matar al enemigo: 
        handleScore(enemy, '200', this);

        //Luego de un 500ms el enemigo desaparece.
        setTimeout(()=>{
            enemy.destroy();
        }, 500)
    }
    else{
        //El enemigo se detiene: 
        enemy.setVelocityX(0);
        mario.setVelocityX(0);
        //De cualquier otra manera en que Mario y su enemigo se toquen, resultará en la muerte de Mario.
        //Este código se explica en detalle al final de la función 'update' del archivo game.js. 
        mario.isDead = true;
        mario.anims.play('mario-dead');
        this.sound.add('gameOver', {volume:0.2}).play();
        setTimeout(()=>{
            mario.setVelocityY(-350)
            mario.setCollideWorldBounds(false);
            //Si mario muere arriba de una plataforma debemos avitar las colisiones para que salga del mapa:
            mario.body.checkCollision.none = true;
        },100);
        setTimeout(()=>{
            this.scene.restart();
        }, 7000);
    };
};

//Colisión con monedas:
//Aunque aquí mario no se usa, es importante ponerlo xq sino crashea.
export function onCatchCoin(mario, coins){
    mario.body.touching.down = false
    //Al tocar la moneda queremos que deje de verse: 
    this.sound.add('catchCoin', {volume:0.2}).play();
    coins.destroy();
    //Colocamos el puntaje: 
    handleScore(coins, '100', this);
}

//Función del puntaje: 
//Esta función reutilizable nos permite colocar puntaje a cualquier colisión u overlap que necesitemos.
function handleScore(origin, score, game){
    //Al momento de capturar una moneda, por ejemplo, debemos colocar el puntaje en texto (ver nota 11):
    const scoreText = game.add.text(origin.x, origin.y, score, {
        fontFamily: 'pixelFont',
        fontSize: 10 //ancho en pixeles
        }); 

    //Aquí utilizamos el método .tweens.add() para hacer la animación ascendente del score (ver nota 12):
    game.tweens.add({
        targets: scoreText,
        duration: 500,
        y: scoreText.y -20,
        //Al terminar la animación, haremos otra animación para quitar el puntaje de pantalla:
        onComplete: () => {
            //Dejamos que se vea por un ratito y luego lo quitamos.
            setTimeout(() => scoreText.destroy(), 1000);
        }
    })
}

//Colision con hongos:
//Los hongos tendrán una doble colisión. Serán estáticos hasta que se los golpee por debajo y luego se moverán. Y al chocar por algún costado, entonces Mario se transforma.  
export function onCatchMushroom(mario, mushroom){
    //El hongo se consume.    
    mushroom.destroy();
    this.physics.world.pause();
    //Sonido de power up:
    this.sound.add('powerUp', {volume:0.2}).play();
    //Detenemos a Mario
    mario.isBlocked = true;
    //Mediante un .setInterval() controlamos un parpadeo para hacer la animación de crecimiento: 
    let i = 0;
    const interval = setInterval(()=>{
        mario.anims.play(
            i % 2 === 0 ? 'mario-idle-grown' : 'mario-idle'
        );
        i++;
    }, 100);

    //Luego de un segundo, retomamos las físicas del juego, cambiamos el estado de mario a grande y limpiamos el intervalo:
    setTimeout(()=>{
        //Como el cuerpo de mario cambia, debemos redefinir el tamaño del recurso: 
        mario.body.setSize(18,32);
        mario.grown = true;
        clearInterval(interval)
        mario.isBlocked = false;
        this.physics.world.resume();
    }, 900) 
}

//Colision con Bloques: 
export function onHitBlock(mario, block){
   if(!mario.grown && mario.body.touching.up){
    this.sound.play('blockBump');
    this.tweens.add({
        targets: block,
        duration: 100,
        y: block.y -20,
        //Al terminar la animación, haremos otra animación para quitar el puntaje de pantalla:
        onComplete: () => {
            //Dejamos que se vea por un ratito y luego lo quitamos.
            this.tweens.add({
                targets: block,
                duration: 200,
                y: block.y +20
            })
        }
    })
   }
   else if(mario.grown && mario.body.touching.up){
    let stones1 = this.add.sprite(block.x -20, block.y-20, 'block-stones').setScale(1.5);
    let stones2 = this.add.sprite(block.x +20, block.y-20, 'block-stones').setScale(1.5);
    stones1.anims.play('mario-broke-block');
    stones2.anims.play('mario-broke-block');
    this.sound.play('blockBroke')
    block.destroy();
    setTimeout(()=>{
        stones1.destroy();
        stones2.destroy();
    }, 200)
   }
}
