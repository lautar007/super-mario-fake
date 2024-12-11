//En este archivo modularizamos la edición de los grupos estáticos del mundo, para que sea más simple crearlos. Cada función controla un recurso.

//Suelos:
//Como el suelo del juego siempre está a la misma altura con respecto a su eje Y, podemos generar los suelos pasando por argumento de la función un arreglo con las coordenadas del eje X en los que queremos que comience a renderizarse el suelo: 
const EJEX_FLOOR = [0, 256, 612, 1078, 1334];

export function createFloor(floor){
    EJEX_FLOOR.forEach(ejeX => {
        floor.create(ejeX, 500, 'floorBricks')
    .setOrigin(0, 0.25).setScale(2).refreshBody();
    });
}

//Monedas:
//Las monedas se agrupan y se muestran según su aparición de izquierda a derecha:
const COORD_COINS = [
    //Grupo 1
    {x:250, y:400}, 
    {x:300, y:400},
    {x:350, y:400},
    {x:400, y:400},
    //Grupo 2
    {x:680, y:260},
    {x:720, y:260},
    {x:760, y:260},
    {x:800, y:260},
    {x:680, y:300},
    {x:720, y:300},
    {x:760, y:300},
    {x:800, y:300},
]

export function createCoins(coins){
    COORD_COINS.forEach(coin =>{
        coins.create(coin.x, coin.y, 'coin').setScale(2).play('coin-spin', true);
    })
}

