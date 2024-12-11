const MARIO_ANIMS = {
    grown:{
        idle: 'mario-idle-grown',
        walk: 'mario-walk-grown',
        jump: 'mario-jump-grown',
        crouch: 'mario-crouch-grown'
    },
    normal:{
        idle: 'mario-idle',
        walk: 'mario-walk',
        jump: 'mario-jump'
    }
}

export function checkControls(mario, keys){
    let anims;
    //Cambiamos las animaciones según mario sea grande o no:
    mario.grown ? anims = MARIO_ANIMS.grown : anims = MARIO_ANIMS.normal;

    //Si mario está muerto o bloqueado, la función retornará.
    //Esto es importante porque sino pueden fallar algunas animaciones: 
    if(mario.isDead || mario.isBlocked) return;
    
    //Función para agacharse: 
    if(keys.down.isDown){
        anims.crouch ? mario.anims.play(anims.crouch, true) : null;
        //Para que no se pueda mover a los costados estando agachado, retornamos.
        return;
    }
    //Una vez que tenemos disponibles los cursores, gracias a que definimos en la función create la propiedad keys del juego, ahora podremos usarlas. Recordemos que aquí estamos usando el objeto entities para acceder a la entidad 'mario'.
    //Ver nota 4.
    if (keys.left.isDown){
        mario.x -= 4;
        //Como previamente hemos creado animaciones para mario, podemos usarla con el método .play(key de la animación, booleano que indica que si ya se está ejecutando no se ejecute de nuevo <ignoreInPlaying>):
        mario.anims.play(anims.walk, true);
        //Como el sprite tiene a mario mirando hacia la derecha, cuando camine hacia la izquierda deberíamos invertir su imagen en el eje x:
        mario.flipX = true;
    } else if (keys.right.isDown){
        mario.x += 4;
        mario.flipX = false;
        mario.anims.play(anims.walk, true);
    }
    //Necesitamos parar a mario para que no se quede corriendo en el mismo lugar:
    else if (mario.body.touching.down){
        mario.anims.play(anims.idle, true);
    }

    //Salto: 
    //¿Por qué el salto está en un if separado? por que queremos que salte y además se mueva hacia los lados. 
    if(keys.up.isDown){
        mario.y -= 6;
        //Podemos controlar la altura del salto con el método '.setVelocityY(velocidad)':
        //Sin embargo, es necesario, para que la entidad no vuele, que el condicional también asegure que el cuerpo de la entidad está tocando por abajo, es decir, el suelo: '.body.touching.down'
        mario.anims.play(anims.jump, true);
    }

};