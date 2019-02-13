"use strict";

window.onload = function () {
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".

    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

    function preload() {
        game.load.image('p1ship', 'assets/p1.png');
        game.load.image('p2ship', 'assets/p2.png');
        game.load.spritesheet('p1shot', 'assets/shot_1a.png', 64, 256);
        game.load.spritesheet('p2shot', 'assets/shot_2a.png', 64, 256);
        //game.load.image('background', 'assets/bg.png')
        // Other wall/tile assets here?
    }

    var player1;
    var player2;
    var p1Bullets;
    var p2Bullets;

    function create() {
        // Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create player sprites
        player1 = game.add.sprite(game.world.centerX, game.world.centerY, 'p1ship');
        player2 = game.add.sprite(game.world.centerX, game.world.centerY, 'p2ship');
        // Anchor player sprites at their center
        player1.anchor.setTo(0.5, 0.5);
        player2.anchor.setTo(0.5, 0.5);
        // Enable & set player physics
        game.physics.enable(player1);
        game.physics.enable(player2);
        player1.body.maxVelocity.set(250);
        player2.body.maxVelocity.set(250);


        //animation for sprite
        //var animation = bouncy.animations.add('blueshot', [0, 1, 2, 3], 60, false);


        // Load background
        //game.add.tileSprite(0, 0, game.width, game.height, 'space');














        // Make it bounce off of the world bounds.
        player1.body.collideWorldBounds = true;





        // Add some text using a CSS style.
        // Center it in X, and position its top 15 pixels from the top of the world.
        var style = {font: "20px Verdana", fill: "#9999ff", align: "center"};
        var text = game.add.text(game.world.centerX, 15, "Why doesn't this work properly qq", style);
        text.anchor.setTo(0.5, 0.0);
    }

    function update() {
        // Accelerate the 'logo' sprite towards the cursor,
        // accelerating at 500 pixels/second and moving no faster than 500 pixels/second
        // in X or Y.
        // This function returns the rotation angle that makes it visually match its
        // new trajectory.
        player1.rotation = game.physics.arcade.accelerateToPointer(player1, game.input.activePointer, 500, 500, 500);
    }
};
