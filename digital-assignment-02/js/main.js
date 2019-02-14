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
    var p1Input;
    var p2Input;
    var p1Text;
    var p2Text;

    // Variables for bullet spawning
    var bullet;
    var bulletTime = 0;


    // Movement & physics variables for fine tuning
    var movementSpeed = 260;
    var turnSpeed = 190;
    var bulletVelocity = 600;
    var fireRate = 70;


    function create() {
        // Start arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Load background
        game.add.tileSprite(0, 0, game.width, game.height, 'background');

        // Create player sprites
        player1 = game.add.sprite(game.world.centerX - 150, game.world.centerY, 'p1ship');
        player2 = game.add.sprite(game.world.centerX + 150, game.world.centerY, 'p2ship');
        player2.angle += 180;
        // Anchor player sprites at their center
        player1.anchor.setTo(0.5, 0.5);
        player2.anchor.setTo(0.5, 0.5);
        // Enable & set player physics
        game.physics.enable(player1, Phaser.Physics.ARCADE);
        game.physics.enable(player2, Phaser.Physics.ARCADE);

        // Ship collision
        player1.enableBody = true;
        player2.enableBody = true;
        player1.body.setSize(40, 40);
        player2.body.setSize(40, 40);

        // Ship HP
        player1.setHealth(100);
        player2.setHealth(100);

        //scoreString = 'Score : ';
        //p1HP = game.add.text(10, 10, player1.Health.toString(), { font: '34px Arial', fill: '#fff' });


        /** DEBUG **/
        //  game.physics.arcade.gravity.y = 200;

        //   game.debug.body(player1);
        //   game.debug.body(player2);

        //  player1.body.bounce.y = 0.9;
        //  player1.body.bounce.x = 0.9;
        //  player2.body.bounce.y = 0.9;
        //  player2.body.bounce.x = 0.9;


        /** DEBUG **/

        // Display controls
        var leftText = {font: "20px Verdana", fill: "#c3b6ff", align: "left"};
        var rightText = {font: "20px Verdana", fill: "#ff6f6b", align: "right"};
        p1Text = game.add.text(game.world.centerX, game.world.centerY, "WASD controls movement\nJ K L controls firing and rotation", leftText);
        p2Text = game.add.text(game.world.centerX, game.world.centerY, "Arrows control movement\n4 5 6 control firing and rotation", rightText);
        p1Text.anchor.setTo(1.2, -3.5);
        p2Text.anchor.setTo(-0.2, -3.5);



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

    }

    function update() {
        // Movement
        playerMovement(player1, p1Input);
        playerMovement(player2, p2Input);

        // Shooting
        if (p1Input.fire.isDown) {
            fireBullet(player1, p1Bullets);
        }
        if (p2Input.fire.isDown) {
            fireBullet(player2, p2Bullets);
        }

        // Collisions & damage
        game.physics.arcade.collide(player1, player2, playerCollide);
        game.physics.arcade.collide(player1, p2Bullets, bulletCollide);
        game.physics.arcade.collide(player2, p1Bullets, bulletCollide);


        // If players hit each other, hide controls
       if (player1.health == 99 || player2.health == 99) {
           p1Text.visible = false;
           p2Text.visible = false;
       }


        // Check if HP is 0 for ending the game
        if (player1.health <= 0 || player2.health <= 0) {

            player1.rotation = game.physics.arcade.accelerateToPointer( player1, game.input.activePointer, 500, 500, 500 );
            player2.rotation = game.physics.arcade.accelerateToPointer( player2, game.input.activePointer, 500, 500, 500 );

            if (player1.health <= 0) {
                player1.kill();
                var style = {font: "35px Verdana", fill: "#ff6f6b", align: "center"};
                var text = game.add.text(game.world.centerX, game.world.centerY, "P2 Victory!", style);
            }
            else {
                player2.kill();
                var style = {font: "35px Verdana", fill: "#c3b6ff", align: "center"};
                var text = game.add.text(game.world.centerX, game.world.centerY, "P1 Victory!", style);
            }

            text.anchor.setTo(0.5, 0.5);

        }


    }


    function playerCollide() {
        var style = {font: "10px Verdana", fill: "#9999ff", align: "left"};
        var text = game.add.text(game.world.centerX - 300, 15, "player collide", style);
        text.anchor.setTo(0.5, 0.0);
    }

    function bulletCollide(player, bullet) {
        // Remove bullet from game
        bullet.kill();

        // Lower HP of hit player
        player.health -= 1;
    }

    // Handles keyboard input mapping for movement
    function playerMovement(player, playerInput) {
        if (playerInput.up.isDown) {
            // Move the player absolute up
            player.body.velocity.y = -(movementSpeed);
        } else if (playerInput.down.isDown) {
            // Move the player absolute down
            player.body.velocity.y = movementSpeed;
        } else {
            player.body.velocity.y = player.body.velocity.y / 2;
        }

        if (playerInput.left.isDown) {
            // Move the player absolute left
            player.body.velocity.x = -(movementSpeed);
        } else if (playerInput.right.isDown) {
            // Move the player absolute right
            player.body.velocity.x = movementSpeed;
        } else {
            player.body.velocity.x = player.body.velocity.x / 2;
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

    function fireBullet(player, playerBullets) {
        if (game.time.now > bulletTime) {
            bullet = playerBullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(player.body.x + 22, player.body.y + 24);
                bullet.lifespan = 2500;
                bullet.rotation = player.rotation;
                game.physics.arcade.velocityFromRotation(player.rotation, bulletVelocity, bullet.body.velocity);
                bulletTime = game.time.now + fireRate;
            }
        }
    }

};
