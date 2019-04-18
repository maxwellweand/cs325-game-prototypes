"use strict";

BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:
    /*
    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    this.load;      //  for preloading assets (Phaser.Loader)
    this.math;      //  lots of useful common math operations (Phaser.Math)
    this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)
    
    //  You can use any of these from any function within this State.
    //  But do consider them as being 'reserved words', i.e. don't create a property for your own game called "world" or you'll over-write the world reference.
    */
    
    // For optional clarity, you can initialize
    // member variables here. Otherwise, you will do it in create().
    this.bouncy = null;
    this.iceblock01 = null;
    this.iceblock02 = null;
    this.iceblock03 = null;
    this.iceblock04 = null;
    this.iceblock05 = null;
    this.iceblock06 = null;
    this.iceblock07 = null;
    this.iceblock08 = null;
    this.iceblock09 = null;
    this.iceblock10 = null;
    this.iceblock11 = null;
    this.iceblock12 = null;
    this.iceblock13 = null;
    this.iceblock14 = null;
    this.iceblock15 = null;
    this.redfish = false;
    this.rosefish = null;
    this.sealgf = null;

};

function rosefishCollision(player, rosefish) {
    this.redfish = true;
    rosefish.kill();

}

function sealCollide() {
    if (this.redfish == true){
        this.quitGame();
    }
}

function rosefishCollision2(sealgf, rosefish) {
  sealgf.body.bounce.y = 1.01;
  sealgf.body.bounce.x = 1.01;
}

BasicGame.Game.prototype = {

    create: function () {

        //this.map = game.add.tilemap('map', 64, 64);
        //this.map.addTilesetImage('tiles');
        //this.layer = this.map.createLayer(0);
        //this.layer.resizeWorld();
        //this.map.setCollision(2);
        //this.map.setCollision(3);
        //this.map.setTileIndexCallback(0, gameOver, this);
        //this.map.setTileIndexCallback(1, gameOver, this);
        this.background = this.add.sprite(0, 0, 'icebg');
        this.background.height = this.game.height;
        this.background.width = this.game.width;








        this.iceblock01 = this.game.add.sprite(0, 0, 'iceblock', 0);
        this.game.physics.enable(this.iceblock01);
        this.iceblock01.body.immovable = true;

        this.iceblock02 = this.game.add.sprite(360, 0, 'iceblock', 0);
        this.game.physics.enable(this.iceblock02);
        this.iceblock02.body.immovable = true;

        this.iceblock03 = this.game.add.sprite(680, 0, 'iceblock', 0);
        this.game.physics.enable(this.iceblock03);
        this.iceblock03.body.immovable = true;

        this.iceblock04 = this.game.add.sprite(64, 64, 'iceblock', 1);
        this.game.physics.enable(this.iceblock04);
        this.iceblock04.body.immovable = true;

        this.iceblock05 = this.game.add.sprite(454, 64, 'iceblock', 0);
        this.game.physics.enable(this.iceblock05);
        this.iceblock05.body.immovable = true;

        this.iceblock06 = this.game.add.sprite(192, 128, 'iceblock', 0);
        this.game.physics.enable(this.iceblock06);
        this.iceblock06.body.immovable = true;

        this.iceblock07 = this.game.add.sprite(128, 192, 'iceblock', 0);
        this.game.physics.enable(this.iceblock07);
        this.iceblock07.body.immovable = true;

        this.iceblock08 = this.game.add.sprite(590, 182, 'iceblock', 1);
        this.game.physics.enable(this.iceblock08);
        this.iceblock08.body.immovable = true;

        this.iceblock09 = this.game.add.sprite(734, 256, 'iceblock', 0);
        this.game.physics.enable(this.iceblock09);
        this.iceblock09.body.immovable = true;

        this.iceblock10 = this.game.add.sprite(192, 320, 'iceblock', 0);
        this.game.physics.enable(this.iceblock10);
        this.iceblock10.body.immovable = true;

        this.iceblock11 = this.game.add.sprite(580, 320, 'iceblock', 0);
        this.game.physics.enable(this.iceblock11);
        this.iceblock11.body.immovable = true;

        this.iceblock12 = this.game.add.sprite(0, 384, 'iceblock', 0);
        this.game.physics.enable(this.iceblock12);
        this.iceblock12.body.immovable = true;

        this.iceblock13 = this.game.add.sprite(428, 384, 'iceblock', 0);
        this.game.physics.enable(this.iceblock13);
        this.iceblock13.body.immovable = true;

        this.iceblock14 = this.game.add.sprite(734, 384, 'iceblock', 0);
        this.game.physics.enable(this.iceblock14);
        this.iceblock14.body.immovable = true;

        this.iceblock15 = this.game.add.sprite(80, 536, 'iceblock', 0);
        this.game.physics.enable(this.iceblock15);
        this.iceblock15.body.immovable = true;













        this.rosefish = this.game.add.sprite(488, 20, 'rosefish');
        this.game.physics.enable(this.rosefish);
        this.rosefish.enableBody = true;


        this.sealgf = this.game.add.sprite(6, 550, 'sealgf');
        this.game.physics.enable(this.sealgf);
        this.sealgf.enableBody = true;
        this.sealgf.body.setSize(48,24,8,8);












        //this.player = game.add.sprite(game.world.centerX, game.world.centerY, 'seal');

        // Create a sprite at the center of the screen using the 'logo' image.
        this.bouncy = this.game.add.sprite( 384, this.game.height - (24+32), 'seal_anim', 1 );
        // Anchor the sprite at its center, as opposed to its top-left corner.
        // so it will be truly centered.
        this.bouncy.anchor.setTo( 0.5, 0.5 );
        this.game.physics.enable( this.bouncy, Phaser.Physics.ARCADE );
        this.bouncy.angle += 0;
        this.bouncy.enableBody = true;
        this.bouncy.body.setSize(32,32,16,16);

        // Turn on the arcade physics engine for this sprite.

        // Make it bounce off of the world bounds.
        this.bouncy.body.collideWorldBounds = true;
        this.sealgf.body.collideWorldBounds = true;
        this.sealgf.body.bounce.y = 0.9;
        this.sealgf.body.bounce.x = 0.9;




        //  Game input
        this.input = this.game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.UP,
            'down': Phaser.KeyCode.DOWN,
            'left': Phaser.KeyCode.LEFT,
            'right': Phaser.KeyCode.RIGHT,
        });


        this.bouncy.body.velocityX = 0;
        this.bouncy.body.velocityY = 0;






        this.bouncy.animations.add('move', [0,1], 10, true);









        // When you click on the sprite, you go back to the MainMenu.
       // this.bouncy.inputEnabled = true;
        //this.bouncy.events.onInputDown.add( function() { this.quitGame(); }, this );
    },

    update: function () {

        //  Honestly, just about anything could go here. It's YOUR game after all. Eat your heart out!

       // this.bouncy.rotation = this.game.physics.arcade.accelerateToPointer( this.bouncy, this.game.input.activePointer, 500, 500, 500 );

        // Movement
        var movementSpeed = 200;

        if (this.input.up.isDown) {
            // Move the player absolute up
            this.bouncy.angle = 0;
            this.bouncy.play('move');
            if (this.bouncy.body.velocity.y == 0 && this.bouncy.body.velocity.x == 0) this.bouncy.body.velocity.y = -(movementSpeed);

        } else if (this.input.down.isDown) {
            // Move the player absolute down
            this.bouncy.angle = 180;
            this.bouncy.play('move');
            if (this.bouncy.body.velocity.y == 0 && this.bouncy.body.velocity.x == 0) this.bouncy.body.velocity.y = movementSpeed;

        } else if (this.input.left.isDown) {
            // Move the player absolute left
            this.bouncy.angle = 270;
            this.bouncy.play('move');
            if (this.bouncy.body.velocity.y == 0 && this.bouncy.body.velocity.x == 0) this.bouncy.body.velocity.x = -(movementSpeed);

        } else if (this.input.right.isDown) {
            // Move the player absolute right
            this.bouncy.angle = 90;
            this.bouncy.play('move');
            if (this.bouncy.body.velocity.y == 0 && this.bouncy.body.velocity.x == 0) this.bouncy.body.velocity.x = movementSpeed;
        } else {
            this.bouncy.animations.stop();
        }





        this.game.physics.arcade.collide(this.bouncy, this.iceblock01);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock02);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock03);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock04);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock05);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock06);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock07);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock08);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock09);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock10);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock11);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock12);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock13);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock14);
        this.game.physics.arcade.collide(this.bouncy, this.iceblock15);


        this.game.physics.arcade.collide(this.bouncy, this.rosefish, rosefishCollision);
        this.game.physics.arcade.collide(this.bouncy, this.sealgf, sealCollide);

        this.game.physics.arcade.collide(this.sealgf, this.iceblock01);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock02);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock03);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock04);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock05);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock06);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock07);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock08);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock09);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock10);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock11);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock12);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock13);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock14);
        this.game.physics.arcade.collide(this.sealgf, this.iceblock15);

        this.game.physics.arcade.collide(this.sealgf, this.rosefish, rosefishCollision2);


        if (this.sealgf.body.bounce.y >= 1.0){
            var style = { font: "55px Verdana", fill: "#ff0015", align: "center" };
            var text = this.game.add.text( this.game.world.centerX, this.game.world.centerY-40, "WHAT A GENTLEMAN!!!", style );
            text.anchor.setTo( 0.5, 0.0 );

        }
    },


    render: function(){
        //this.game.debug.body(this.sealgf);
        //this.game.debug.body(this.bouncy);
    },

    quitGame: function () {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        this.music.stop();
        this.state.start('MainMenu');

    },









};
