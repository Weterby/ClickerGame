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
            {name: 'Spider', image: 'spider', maxHealth: 5},
            {name: 'Bat', image: 'bat', maxHealth: 10},
            {name: 'Slime', image: 'slime', maxHealth: 15}
        ];
        //loop trough every monster and setup on scene
        this.monsters = this.add.group();
        let monster;
        monsterData.forEach((data) => {
            //create a sprite for them off screen
            monster = state.monsters.create(1000, centerY, data.image);
            monster.setScale(1, 1);
            //reference to the database
            monster.details = data;
            // use the built in health component
            monster.health = monster.details

            monster.setInteractive();
            monster.on('pointerup', state.onClickMonster, this);
        });

        //pick random monster from group
        this.currentMonster = this.monsters.getChildren()[Phaser.Math.Between(0, this.monsters.getLength() - 1)];
        //set his position to the middle so we can see it
        this.currentMonster.setPosition(centerX, centerY);
        //set current health equal to the its maximum
        this.currentMonster.health = this.currentMonster.details.maxHealth;
    }

    onClickMonster(){
        this.currentMonster.health-=this.player.clickDmg;
        if(this.currentMonster.health<=0) this.onKilledMonster();
        console.log(this.currentMonster.health);
    }

    onKilledMonster(){
        // reset the currentMonster before we move him
        this.currentMonster.setPosition(1000, centerY);
        // now pick the next in the list, and bring him up
        this.currentMonster = this.monsters.getChildren()[Phaser.Math.Between(0, this.monsters.getLength() - 1)];
        this.currentMonster.health=this.currentMonster.details.maxHealth
        this.currentMonster.setPosition(centerX, centerY);
    }

    update() {
        //add text that describes monster name
        this.add.text(centerX - this.currentMonster.width / 2,
            centerY + this.currentMonster.height / 2,
            this.currentMonster.details.name,
            {fontSize: '24px', fill: '#FFF'});

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
