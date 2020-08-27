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
        //currency
        this.load.image('coin', 'src/img/coin.png');
        this.load.image('diamond', 'src/img/diamond.png');
        this.load.image('ingot', 'src/img/gold_ingots.png');
        //upgrade menu
        this.load.image('menu-arrow', 'src/img/arrow.png');
        this.load.image('glove1', 'src/img/glove1.png');
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
        // setup each of background layers to take the full screen
        this.background = this.add.group();
        ['background1'] //need to add several parts of background
            .forEach(function (image) {
                let bg = state.add.tileSprite(centerX, centerY, 0, 0, image, '', state.background);
                //bg.setTileScale(1,1);
            });
        //currency database
        this.currencyData = ['ingot','coin','diamond'];
        //monster database
        let monsterData = [
            {name: 'Spider', image: 'spider', maxHealth: 5},
            {name: 'Bat', image: 'bat', maxHealth: 10},
            {name: 'Slime', image: 'slime', maxHealth: 15}
        ];
        //loop trough every monster and setup it on scene
        this.monsters = this.add.group();
        let monster;
        monsterData.forEach((data) => {
            //create a sprite for them off screen
            monster = state.monsters.create(1000, centerY, data.image);
            monster.setScale(3, 3);
            //reference to the database
            monster.details = data;
            //use the built in health component
            monster.health = monster.details
            //make the sprite interactive
            monster.setInteractive();
            monster.on('pointerup', state.onClickMonster, this);
        });

        //pick random monster from group
        this.currentMonster = this.monsters.getChildren()[Phaser.Math.Between(0, this.monsters.getLength() - 1)];
        //set his position to the middle so we can see it
        this.currentMonster.setPosition(centerX, centerY);
        //set current health equal to the its maximum
        this.currentMonster.health = this.currentMonster.details.maxHealth;
        //set monster name text
        this.monsterNameText = this.add.text(centerX, 30, this.currentMonster.details.name, {
            font: '48px Arial Black',
            fill: '#fff',
            strokeThickness: 2
        }).setOrigin(0.5);
        //set monster health text
        this.monsterHealthText = this.add.text(centerX, 80, this.currentMonster.health + ' HP', {
            font: '32px Arial Black',
            fill: '#ff0000',
            strokeThickness: 2
        }).setOrigin(0.5);
        //set monster gold text
        this.goldText = this.add.text(0, 0, 'Gold: '+this.player.gold, {
            font: '24px Arial Black',
            fill: '#f6d561',
        });

        let rect = this.add.rectangle(0, 0, 250, 400, '#FFFFFF').setOrigin(0, 0);
        rect.fillAlpha=0.3;
        rect.setStrokeStyle(3, 0x6d54cb);

        this.upgradeMenu = this.add.container(0,100);

        this.isMenuShown = true;
        let gloveSprite = this.add.image(0,0,'glove1').setOrigin(0,0).setScale(2);
        let arrowMenu = this.add.image(250+32,32,'menu-arrow');
        arrowMenu.setInteractive();
        arrowMenu.on('pointerup',()=>{
            let xValue;
            if(this.isMenuShown) {xValue=-250; this.isMenuShown=false;}
            else {xValue=0; this.isMenuShown=true;}
            this.tweens.add({
                targets: this.upgradeMenu,
                x:xValue,
                duration:1000
            })
        })

        this.upgradeMenu.add(gloveSprite);
        this.upgradeMenu.add(arrowMenu);
        this.upgradeMenu.add(rect);
    }

    //method that trigger when monster is clicked
    onClickMonster(){
        this.currentMonster.health-=this.player.clickDmg;
        this.monsterHealthText.text=this.currentMonster.health+ ' HP';
        this.dmgTextTween();
        if(this.currentMonster.health<=0) this.onKilledMonster();
        console.log(this.currentMonster.health);
    }

    //method that trigger when monster is killed
    onKilledMonster(){
        // reset the currentMonster before we move him
        this.currentMonster.setPosition(1000, centerY);
        // now pick the next in the list, and bring him up
        this.currentMonster = this.monsters.getChildren()[Phaser.Math.Between(0, this.monsters.getLength() - 1)];
        this.currentMonster.health=this.currentMonster.details.maxHealth
        this.currentMonster.setPosition(centerX, centerY);
        this.goldDrop();
        this.monsterNameText.text=this.currentMonster.details.name;
        this.monsterHealthText.text=this.currentMonster.health + ' HP';
    }

    //dmg text animation
    dmgTextTween(){
        let dmgText = this.add.text(this.input.mousePointer.x,
            this.input.mousePointer.y,
            this.player.clickDmg,
            {font: '32px Arial Black',
            fill: '#fff',
            strokeThickness: 4});
        this.tweens.add({
            targets:dmgText,
            y:this.input.mousePointer.y-100,
            alpha: { from: 1, to: 0 },
            duration:500,
            ease:'Power1',
            onComplete: () =>{
                dmgText.destroy();
            }
        })
    }

    goldDrop(){
        for(let i=0;i<3;i++){
            let random = this.currencyData[Phaser.Math.Between(0, this.currencyData.length - 1)];
            let image = this.add.image(centerX, centerY+75, random);
            // image.setScale(0.5);
            this.tweens.add({
                targets: image,
                props: {
                    x: { value: centerX+Phaser.Math.Between(-200,200), duration: 1000, ease: 'Power1' },
                    y: { value: centerY-Phaser.Math.Between(50,150), duration: 500, ease: 'Power1', yoyo: true },
                    alpha: { from: 0, to: 1, duration:1000 }
                },
                onComplete: () => {image.setInteractive();}
            });

            image.on('pointerover', () =>{
                image.active=false;
                this.tweens.add({
                    targets:image,
                    alpha: { from: 1, to: 0 },
                    duration: 200,
                    onComplete: () =>{
                        image.destroy();
                        this.player.gold++;
                        // console.log(this.player.gold);
                        this.goldText.text='Gold: ' + this.player.gold;
                    }
                })
            },this)
        }
    }

    update() {
    }
}

let config = {
    type: Phaser.AUTO,
    parent: 'trtt',
    width: 800,
    height: 600,
    scene: [
        BootScene,
        GameScene
    ],
    pixelArt: true,
    domCreateContainer: true
};
let game = new Phaser.Game(config);

const centerX = config.width/2;
const centerY = config.height/2;
