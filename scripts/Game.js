class BootScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'BootScene',
            active: true
        });
    }

    preload() {
        //backgrounds
        this.load.image('background1', 'src/img/background1.png');
        //specials
        this.load.image('coin', 'src/img/coin.png');
        //monsters
        this.load.image('spider', 'src/img/spider.png');
        this.load.image('bat', 'src/img/bat.png');
        this.load.image('slime', 'src/img/slime.png');
    }

    create() {
        this.scene.start('GameScene');
    }
}

class GameScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameScene',
        });
    }
    
    create() {
        let state = this;
        //main character stats
        this.player = {
            gold: 0,
            clickDmg: 1
        };
        // setup each of our background layers to take the full screen
        this.background = this.add.group();
        ['background1'] //need to add several parts of background
            .forEach(function (image) {
                let bg = state.add.tileSprite(centerX, centerY, 0, 0, image, '', state.background);
                //bg.setTileScale(1,1);
            });

        //monster database
        let monsterData = [
            {name: 'Spider', image: 'spider'},
            {name: 'Bat', image: 'bat'},
            {name: 'Slime', image: 'slime'}
        ];

        //loop trough every monster and setup on scene
        this.monsters = this.add.group();
        let monster;
        monsterData.forEach(function (data) {
            //create a sprite for them off screen
            monster = state.monsters.create(1000, centerY, data.image);
            monster.setScale(1, 1);
            //reference to the database
            monster.details = data;
            //enable input so we can click it
            monster.inputEnabled = true;
            //trigger an event on mouse click
            monster.setInteractive();
            monster.on('pointerdown', state.onClickMonster);
        });

        //pick random monster from group
        this.currentMonster = this.monsters.getChildren()[Phaser.Math.Between(0, this.monsters.getLength() - 1)];
        this.currentMonster.setPosition(centerX, centerY);
    }

    update() {
        // this.add.text(300, 300, 'Adventure awaits!', { fontSize: '24px', fill: '#FFF' });
        //add text that describes monster name
        this.add.text(centerX - this.currentMonster.width / 2,
            centerY + this.currentMonster.height / 2,
            this.currentMonster.details.name,
            {fontSize: '24px', fill: '#FFF'});
    }

    onClickMonster(){

    }
}

let config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [
        BootScene,
        GameScene
    ]
};
let game = new Phaser.Game(config);

const centerX = config.width/2;
const centerY = config.height/2;
