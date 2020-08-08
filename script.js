var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 }
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let game = new Phaser.Game(config);

function preload ()
{
    //backgrounds
    this.load.image('background1', 'src/img/background1.png');
    //specials
    this.load.image('coin', 'src/img/coin.png');
    //monsters
    this.load.image('spider', 'src/img/spider.png');
    this.load.image('bat', 'src/img/bat.png');
    this.load.image('slime', 'src/img/slime.png');
}

function create ()
{
    let monsterData = [
        {name: 'Spider', image: 'spider'},
        {name: 'Bat', image: 'bat'},
        {name: 'Slime', image: 'slime'}
    ];

    let backgroundData = [
        {name: 'Violet Forest', image: 'background1'},
    ]
    
    this.player={
        gold: 0,
        clickDmg:1
    };


    let background1 = this.add.image(400, 300, 'background1');
   // let coin = this.add.image(400, 300, 'coin');
}

function update ()
{
    this.add.text(300, 300, 'Adventure awaits!', { fontSize: '24px', fill: '#FFF' });
}
