//En este archivo tenemos la función para generar las imágenes estáticas. 

const INIT_IMAGES = [
    {
        key:'cloud1',
        path:'/assets/scenery/overworld/cloud1.png'
    },
    {
        key:'floorBricks',
        path:'/assets/scenery/overworld/floorbricks.png'
    },
    {
        key:'block',
        path:'/assets/blocks/overworld/block.png'
    },
    {
        key:'superMushroom',
        path: '/assets/collectibles/super-mushroom.png'
    }
];

export function initImages(load){
    INIT_IMAGES.forEach(i =>{
        load.image(i.key, i.path)
    })
};
