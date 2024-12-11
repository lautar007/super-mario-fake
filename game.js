console.log("Comenzando función");

//Importaciones: (CON EXTENSION DEL ARCHIVO: .js!)
//Animaciones: 
import { createAnimations } from "./animations.js";
//Controles: 
import { checkControls } from "./controls.js";
//Función que inicia las imágenes: 
import { initImages } from "./images.js";
//Funciones de colisión:
import { onHitEnemy, onCatchCoin, onCatchMushroom } from "./collideFunctions.js";
//Función que inicia los audios: 
import { initAudio } from "./audios.js";
//Función que inicia los spritesheets (visuales):
import { initSpriteSheets } from "./spriteSheets.js";
//Funciones del editor de mundo: 
import { createFloor, createCoins } from "./worldEditorFunc.js";

//--------------------------------------------------------------
//Este videojuego está hecho con una librería llamada Phaser. Esta librería consta de un archivo js que nos provee de un objeto. Este objeto contiene métodos necesarios para poder desarrollar el juego. Podremos acceder a este objeto mediante window.Phaser. 
//Para comenzar cualquier proyecto con phaser, necesitamos establecer primero las configuraciones del juego: 

const config = {
    
    //El tipo de motor será la variable global Phaser, que tiene varias opciones de renderizado (webgml, canvas, etc.) Al colocarlo en auto, el motor busca la forma de renderizar automáticamente.
    type: Phaser.AUTO, 

    //Luego colocamos las propiedades de tamaño del juego. Aquí utilizamos el tamaño original del juego Super Mario Bros.
    width: 556,
    height: 544,

    //Como color de fondo y para contrastar con el negro de fondo de la página HTML, elegimos blanco para saber que el juego está funcionando:
    backgroundColor: "#049cd8",

    //Luego debemos indicarle al motor dentro de cuál etiqueta se renderiza el juego. Para ello la página contiene un <div> con el id = "game":
    parent: "game",

    //Físicas. (ver nota 6)
    physics: {
        //Pondremos por defecto la física arcade.
        default: 'arcade',
        //podremos configurar este tipo de físicas:
        arcade: {
            //Por ejemplo, podemos darle valor a la gravedad en ambos ejes:
            gravity: {y: 300},
            //El debug es una propiedad que permite que podamos tener más información sobre las físicas, pero por ahora no lo necesitamos.
            debug: false,
        },
    },

    //Ahora viene la escena, donde como mínimo necesitaremos dos cosas: 'preload' (una función que sirve para recargar recursos previos del juego) y 'create' (una función que se ejecuta al iniciar el juego).
    //También existe 'update', un método que se ejecuta en cada frame del juego mientras se esté ejecutando.
    scene: {
        preload,
        create,
        update
    },
};

//Creando una nueva instancia de juego con la configuración establecida: 
//Aquí yo supongo que estamos creando un objeto nuevo, 'game', utilizando una clase, es decir, una plantilla. 
//Al usar este objeto y pasandole las configuraciones que hemos detallado, tendrá entonces las propiedades de config y las que vienen con la propia clase 'Game'. Por lo que, para poder referirnos al juego, podemos usar la palabra reservada 'this', que en JS hace referencia al mismo objeto en sí. 
new Phaser.Game(config);

//Función precarga, se ejecuta primero.
//Esta función simplemente carga los recursos necesarios para comenzar el juego, luego hay que ubicarlos con la función create.
function preload () {
    console.log("precarga.")
    const {load} = this;
    //En el preload cargaremos imágenes. En este caso comenzaremos con una nube. Para cargar usamos el método 'load.image()' del game('this'):
    //Este método lleva como argumentos, primero un nombre de id y segundo la ubicación del recurso imagen.
    //load.image('cloud1', '/assets/scenery/overworld/cloud1.png');
    //Actualmente usamos una función para modularizar el proceso:
    initImages(this.load);

    //Ahora cargaremos el sprite sheet de Mario (ver nota 2).
    //Este método '.spritesheet()' además del id y la ubicación del recurso, toma como tercer argumento un objeto con dos propiedades:
    //frameWidth y frameHeight (ver nota 3).
    //Como los recursos son muchos, hemos modularizado la función a otro archivo.
    initSpriteSheets(load);

    //Cargando AUDIOS!!: (ver nota 9) 
    initAudio(this.load);
};

//Función crear, se ejecuta segundo. 
function create () {
    console.log("comienzo.")
    
    //------------------------------------ANIMACIONES--------------------------------
    //Activamos las animaciones:
    //Todas las animaciones van si o si debajo de esto.
    createAnimations(this)
    
    //-----------------------------IMAGENES DE ESCENARIO----------------------------------
    //Sigamos con el ejemplo de la nube. En este caso utilizaremos la función 'add.image()'
    //Esta función toma como argumentos dos coordenadas, para el posicionamiento en eje x, y, y el id del recurso que previamente cargamos en la función preload.
    //Las coordenadas posicionan la imagen segun su centro, por lo que es normal que en coordenadas 0,0, la imagen tenga su centro en la esquina superior izquierda.
    // (eje X, eje Y, id):
    this.add.image(150, 50, 'cloud1')

    //Para que la imagen no tome como referencia el centro, sino el comienzo de la imagen, entonces podemos concatenar el siguiente método:
    //Ver nota 1.
    .setOrigin(0,0)

    //Notaremos que el tamaño de la imagen es muy grande, por lo que debemos escalarla para adaptar el tamaño.
    //concatenamos con la función 'setScale()' que toma como argumento el multiplicador de la escala.
    //Es decir, si queremos duplicar el tamapaño, el valor debe ser 2. Si queremos reducir el tamaño a la mitad, el valor es 0.5. 
    .setScale(0.5)
    this.add.image(560, 80, 'cloud1').setOrigin(0,0).setScale(0.5);

    //-----------------------------------ENTIDADES-----------------------------------
    //Para poder usar una entidad con los comandos, necesitamos que esté cargado en el juego, esto se puede hacer de varias formas, pero crearemos una propiedad 'entities' en donde podamos tener todos los personajes que se muevan. Será un objeto vacío, pero le iremos colocando propiedades al momento de crear la entidad.
    this.entities = {}

    //Creando el mario: Aquí estamos usando el sprite, ya no es un imagen simple. Aquí es donde de paso generamos la propiedad 'mario' dentro de nuestro objeto de entidades. (ver nota 6 para entender las físicas)
    this.entities.mario = this.physics.add.sprite(50, 420, 'mario').setScale(2)
    //Ahora que hemos colocado el sprite dentro de la propiedad physics, podemos asignarle gravedad:
    .setGravityY(300)
    //El método '.setCollideWorldBounds(true)', es el que genera la colisión del personaje con respecto a los bordes de la pantalla de juego.
    .setCollideWorldBounds(true);

    //CONDICIONES INICIALES DEL PERSONAJE: 
    //Aquí ponemos aquellas propiedades del personaje que van a cambiar en el futuro: 
    //El personaje comienza vivo: 
    this.entities.mario.isDead = false; 
    //El personaje comienza siendo pequeño: 
    this.entities.mario.grown = false;

    //Cargando enemigo (goomba):
    this.entities.goomba1 = this.physics.add.sprite(520, 420, 'goomba').setScale(2)
    //Al controlar la velocidad en X podemos hacer que el goomba se mueva hacia Mario: 
    .setVelocityX(-50)
    this.entities.goomba2 = this.physics.add.sprite(480, 420, 'goomba').setScale(2).setVelocityX(-50)

    //Lista de enemigos del nivel.
    let enemies = ['goomba1', 'goomba2'];

    //---------------------------FÍSICAS Y COLISIONES--------------------------------
    //Para que Mario no se caiga, debemos controlar la física del suelo, por lo tanto crearemos una nuevo propiedad en el juego que agrupe las plataformas, ya que no hay una sola y el mismo suelo del juego está dividido, generando zonas de vacío donde sí queremos que el personaje pueda caerse. (Ver nota 7)
    this.floor = this.physics.add.staticGroup()

    //Conjunto de plataformas del suelo: 
    createFloor(this.floor);
    
    //Estableciendo colisiones con el suelo:
    this.physics.add.collider(this.entities.mario, this.floor);
    
    //Generando monedas:
    //Las monedas también son un conjunto que comparte la misma física (ver nota 7)
    this.coins = this.physics.add.staticGroup();
    createCoins(this.coins);

    //Colision con las monedas:
    //El método '.overlap()', es similar al collider, vemos que usa los mismos argumentos, pero no queremos que Mario choque con la moneda, sino que pase por encima.
    this.physics.add.overlap(this.entities.mario, this.coins, onCatchCoin, null, this);

    //Generando hongos: 
    this.mushrooms = this.physics.add.staticGroup();
    this.mushrooms.create(1210, 400, 'superMushroom').setScale(2);
    //Físicas del hongo:
    this.physics.add.overlap(this.entities.mario, this.mushrooms, onCatchMushroom, null, this);

    //COLISIONES DE ENEMIGOS -----------------------
    //Usando la lista de enemigos podemos darles a todos por igual la colisión con el suelo:
    enemies.forEach(e => this.physics.add.collider(this.entities[e], this.floor))
    //Sin usar una lista:
    //this.physics.add.collider(this.entities.goomba1, this.floor);
    //Colisiones entre entidades (ver nota 10).
    this.physics.add.collider(this.entities.mario, this.entities.goomba1, onHitEnemy, null, this);
    this.physics.add.collider(this.entities.mario, this.entities.goomba2, onHitEnemy, null, this);
    //----------------------------------------------

    //Límites del mundo (Ver nota 8)
    this.physics.world.setBounds(0, 0, 2000, config.height); 


    //---------------------------------SEGUIMIENTO DE CÁMARA-------------------------
    this.cameras.main.setBounds(0, 0, 2000, config.height); 
    this.cameras.main.startFollow(this.entities.mario);

    //Creando suelo: la función '.tileSprite()' sirve para rellenar parte del escenario con una imagen. Su sintaxis es la siguiente: '.tileSprite(eje X, eje Y, ancho que debe rellenar, alto que debe rellenar, id)' . Como vemos, los ejes X y Y serán el punto de partida y luego definimos cuanto de alto y ancho queremos rellenar.
    //YA NO LA USAMOS PORQUE ESTAMOS CREANDO EL SUELO CON FÍSICAS.
    // this.add.tileSprite(0, config.height, config.width, 64, 'floorBricks')
    // .setScale(2);
    
    //------------------------------------ANIMACIONES--------------------------------
    //Cuando las animaciones no dependen de una tecla, las colocamos aquí:
    //Goombas:
    this.entities.goomba1.anims.play('goomba-walk', true);
    this.entities.goomba2.anims.play('goomba-walk', true);

    //-------------------------------------CONTROLES-----------------------------------
    //Seguidamente vamos a darle las teclas del cursor como mandos del juego. Para eso definiremos la propiedad .keys en el juego y será igual a un método que hará que los cursores estén disponibles dentro de la función update: 
    this.keys = this.input.keyboard.createCursorKeys();
};

//Función actualizar, se ejecuta tercero y entra en bucle continuo. 
function update () {

    const {mario} = this.entities;
    const {keys} = this;
    //Si nuestro personaje está muerto, no hay nada que actualizar, por lo que podemos retornar: 
    if(mario.isDead) return;

    //Ejecutamos la función de los controles pasando como argumento la entidad y las teclas:
    checkControls(mario, keys);

    //Controlemos la muerte del mario al caerse: 
    //El condicional mide la posición de mario >= altura del escenario - la altura máxima de mario.
    if(mario.y >= config.height -32){
        //podemos indicar que nuestro personaje está muerto con la propiedad '.isDead'.
        //Esto nos sirve para controlar aspectos cuando nuestro personaje esté muerto colocando condicionales en base a esta propiedad.
        mario.isDead = true;
        //animación de la muerte.
        mario.anims.play('mario-dead');
        //Colocamos el audio de juego terminado. 
        this.sound.add('gameOver', {volume:0.2}).play();
        //Luego de 100ms vamos a hacer que Mario de el clásico brinco cuando muere:
        setTimeout(()=>{
            //saltito:
            mario.setVelocityY(-350)
            //luego queremos que el personaje se caiga por lo que desactivamos la colisión con el suelo: 
            mario.setCollideWorldBounds(false);
        },100)
        //Pero además, cuando pasen dos segundos debe resetear la escena:
        setTimeout(()=>{
            this.scene.restart();
        }, 7500)
    }
};

