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
        game.load.spritesheet('p1shot', 'assets/shot_2a.png', 32, 32);
        game.load.spritesheet('p2shot', 'assets/shot_2b.png', 32, 32);
        game.load.image('background', 'assets/bg.jpg')
        // Other wall/tile assets here?
    }

    var player1;
    var player2;
    var p1Bullets;
    var p2Bullets;


    var bullet;
    var bulletTime = 0;

    var p1Input;
    var p2Input;


    // Movement & physics variables for fine tuning
    var movementSpeed = 5;
    var turnSpeed = 190;
    var bulletVelocity = 600;
    var fireRate = 70;


    function create() {
        // Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Load background
        game.add.tileSprite(0, 0, game.width, game.height, 'background');

        // Create player sprites
        player1 = game.add.sprite(game.world.centerX, game.world.centerY, 'p1ship');
        player2 = game.add.sprite(game.world.centerX, game.world.centerY, 'p2ship');
        // Anchor player sprites at their center
        player1.anchor.setTo(0.5, 0.5);
        player2.anchor.setTo(0.5, 0.5);
        // Enable & set player physics
        game.physics.enable(player1);
        game.physics.enable(player2);
        //player1.body.maxVelocity.set(250);
        //player2.body.maxVelocity.set(250);


        //animation for sprite
        //var animation = bouncy.animations.add('blueshot', [0, 1, 2, 3], 60, false);





        // Player 1 Bullets
        p1Bullets = game.add.group();
        p1Bullets.enableBody = true;
        p1Bullets.physicsBodyType = Phaser.Physics.ARCADE;
        p1Bullets.createMultiple(40, 'p1shot');
        p1Bullets.setAll('anchor.x', 0.5);
        p1Bullets.setAll('anchor.y', 0.5);
        p1Bullets.callAll('animations.add', 'animations', 'travel', [0, 1, 2, 3, 4, 5, 6, 7], 60, true);
        p1Bullets.callAll('play', null, 'travel');


        // Player 2 Bullets
        p2Bullets = game.add.group();
        p2Bullets.enableBody = true;
        p2Bullets.physicsBodyType = Phaser.Physics.ARCADE;
        p2Bullets.createMultiple(40, 'p2shot');
        p2Bullets.setAll('anchor.x', 0.5);
        p2Bullets.setAll('anchor.y', 0.5);
        p2Bullets.callAll('animations.add', 'animations', 'travel', [0, 1, 2, 3, 4, 5, 6, 7], 60, true);
        p2Bullets.callAll('play', null, 'travel');





        // Players confined to single screen
        player1.body.collideWorldBounds = true;
        player2.body.collideWorldBounds = true;


        //  Game input
        p1Input = game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.W,
            'down': Phaser.KeyCode.S,
            'left': Phaser.KeyCode.A,
            'right': Phaser.KeyCode.D,
            'tiltLeft': Phaser.KeyCode.J,
            'tiltRight': Phaser.KeyCode.L,
            'fire': Phaser.KeyCode.K
        });
        p2Input = game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.UP,
            'down': Phaser.KeyCode.DOWN,
            'left': Phaser.KeyCode.LEFT,
            'right': Phaser.KeyCode.RIGHT,
            'tiltLeft': Phaser.KeyCode.NUMPAD_4,
            'tiltRight': Phaser.KeyCode.NUMPAD_6,
            'fire': Phaser.KeyCode.NUMPAD_5
        });


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


        // Movement
        playerMovement(player1, p1Input);
        playerMovement(player2, p2Input);

        // Shooting
        if (p1Input.fire.isDown){
            fireBullet(player1, p1Bullets);
        }
        if (p2Input.fire.isDown){
            fireBullet(player2, p2Bullets);
        }



    }


    // Handles keyboard input mapping for movement
    function playerMovement(player, playerInput) {
        if (playerInput.up.isDown) {
            // Move the player absolute up
            player.y -= movementSpeed;
        } else if (playerInput.down.isDown) {
            // Move the player absolute down
            player.y += movementSpeed;
        }

        if (playerInput.left.isDown) {
            // Move the player absolute left
            player.x -= movementSpeed;
        } else if (playerInput.right.isDown) {
            // Move the player absolute right
            player.x += movementSpeed;
        }

        // Tilt
        if (playerInput.tiltLeft.isDown) {
            // Rotate the player counterclockwise
            player.body.angularVelocity = -(turnSpeed);
        } else if (playerInput.tiltRight.isDown) {
            // Rotate the player clockwise
            player.body.angularVelocity = turnSpeed;
        } else {
            player.body.angularVelocity = 0;
        }
    }

    function fireBullet(player, playerBullets){
        if (game.time.now > bulletTime)
        {
            bullet = playerBullets.getFirstExists(false);

            if (bullet)
            {
                bullet.reset(player.body.x + 22, player.body.y + 24);
                bullet.lifespan = 2500;
                bullet.rotation = player.rotation;
                game.physics.arcade.velocityFromRotation(player.rotation, bulletVelocity, bullet.body.velocity);
                bulletTime = game.time.now + fireRate;
            }
        }
    }

};
