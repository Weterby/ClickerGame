var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

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
    let state = this;
    const WIDTH = config.width/2;
    const HEIGHT = config.height/2;
    this.player={
        gold: 0,
        clickDmg:1
    };

    // setup each of our background layers to take the full screen
    this.background = this.add.group();
    ['background1'] //need to add several parts of background
        .forEach(function(image) {
            let bg = state.add.tileSprite(WIDTH, HEIGHT, 0, 0, image, '', state.background);
            //bg.setTileScale(1,1);
        });

    let monsterData = [
        {name: 'Spider', image: 'spider'},
        {name: 'Bat', image: 'bat'},
        {name: 'Slime', image: 'slime'}
    ];

    this.monsters = this.add.group();
    let monster;
    monsterData.forEach(function(data) {
        // create a sprite for them off screen
        monster = state.monsters.create(1000, HEIGHT, data.image);
        // reference to the database
        monster.details = data;

        //enable input so we can click it!
        monster.inputEnabled = true;
        //monster.events.onInputDown.add(state.onClickMonster, state);
        monster.setInteractive();
        // monster.on('pointerdown', function (pointer){alert("it works")})
    });
}

function update ()
{
    this.add.text(300, 300, 'Adventure awaits!', { fontSize: '24px', fill: '#FFF' });
}
