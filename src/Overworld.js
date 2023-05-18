class Overworld extends Phaser.Scene {
    constructor() {
        super('Overworld');
    }

    preload() {
        this.load.path = './assets/';
        this.load.spritesheet('slime', 'slime.png', {frameWidth: 16, frameHeight: 16});
        this.load.image('tilesetImage', 'tileset.png');
        this.load.tilemapTiledJSON('tilemapJSON', 'area01.json');
    }

    create() {
        //add tilemap data
        const map = this.add.tilemap('tilemapJSON');
        //attach tileset image to tilemap
        const tileset = map.addTilesetImage('tileset', 'tilesetImage');
        //add layers
        //background
        const bgLayer = map.createLayer('Background', tileset, 0, 0);
        //terrain
        const terrainLayer = map.createLayer('Terrain', tileset, 0, 0);
        //trees
        const treeLayer = map.createLayer('Trees', tileset, 0, 0);
        
        //find player spawn
        const slimeSpawn = map.findObject('Spawns', obj => obj.name == 'slimeSpawn');
        //add player
        //add physics
        this.slime = this.physics.add.sprite(slimeSpawn.x,slimeSpawn.y, 'slime', 0);

        //create and start animation
        this.anims.create({
            key: 'jiggle',
            frameRate: 8,
            repeat: -1,
            frames: this.anims.generateFrameNumbers('slime', {start: 0, end: 1})
        });
        this.slime.play('jiggle');

        //set world collision
        this.slime.body.setCollideWorldBounds(true);
        //set a velocity variable
        this.VEL = 100;
        //setup cursor
        this.cursors = this.input.keyboard.createCursorKeys();


        //Camera bounds & Follow
        //set camera bounds
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
        //make camera follow
        this.cameras.main.startFollow(this.slime, true, 0.25, 0.25);

        //set physics world bounds
        this.physics.world.bounds.setTo(0,0,map.widthInPixels, map.heightInPixels);

        //set collision by property on terrain layer
        terrainLayer.setCollisionByProperty({collides: true});
        //create player/terrain collider
        this.physics.add.collider(this.slime, terrainLayer);
    }

    update() {
        this.direction = new Phaser.Math.Vector2(0);
        if(this.cursors.left.isDown) {
            this.direction.x = -1;
        } else if (this.cursors.right.isDown) {
            this.direction.x = 1;
        }
        if(this.cursors.up.isDown) {
            this.direction.y = -1;
        } else if (this.cursors.down.isDown) {
            this.direction.y = 1;
        }
        this.direction.normalize();
        this.slime.setVelocity(this.VEL * this.direction.x, this.VEL * this.direction.y);
    }
}