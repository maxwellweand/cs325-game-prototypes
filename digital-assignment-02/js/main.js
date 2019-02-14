"use strict";

window.onload = function () {
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game', {preload: preload, create: create, update: update});

    function preload() {
        game.load.image('p1ship', 'assets/p1.png');
        game.load.image('p2ship', 'assets/p2.png');
        game.load.spritesheet('p1shot', 'assets/shot_2a.png', 32, 32);
        game.load.spritesheet('p2shot', 'assets/shot_2b.png', 32, 32);
        game.load.image('background', 'assets/bg.png')
        game.load.audio('explosion', 'assets/explosion.wav');
        game.load.spritesheet('p1explosion', 'assets/shot_1a.png', 64, 64);
        game.load.spritesheet('p2explosion', 'assets/shot_1b.png', 64, 64);
    }

    var player1;
    var player2;
    var p1Bullets;
    var p2Bullets;
    var p1Input;
    var p2Input;
    var p1Text;
    var p2Text;
    var p1HPText;
    var p2HPText;

    // Explosion FX
    var explosionFX;

    // Variables for bullet spawning
    var bullet;
    var p1BulletTime = 0;
    var p2BulletTime = 0;

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

        // Explosion sound effect
        explosionFX = game.add.audio('explosion');

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
        p1HPText = game.add.text(40, 10, 100, {font: '84px Arial', fill: '#00ff00'});
        p2HPText = game.add.text(650, 10, 100, {font: '84px Arial', fill: '#00ff00'});
        p1HPText.alpha = 0.6;
        p2HPText.alpha = 0.6;

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
            fireBulletP1();
        }
        if (p2Input.fire.isDown) {
            fireBulletP2();
        }

        // Collisions & damage
        game.physics.arcade.collide(player1, player2);
        game.physics.arcade.collide(player1, p2Bullets, bulletCollide);
        game.physics.arcade.collide(player2, p1Bullets, bulletCollide);

        // Update HP counters
        p1HPText.text = player1.health;
        p2HPText.text = player2.health;


        // If players hit each other, hide controls
        if (player1.health == 99 || player2.health == 99) {
            p1Text.visible = false;
            p2Text.visible = false;
        }


        // Check if HP is 0 for ending the game
        if (player1.health <= 0 || player2.health <= 0) {

            player1.rotation = game.physics.arcade.accelerateToPointer(player1, game.input.activePointer, 500, 500, 500);
            player2.rotation = game.physics.arcade.accelerateToPointer(player2, game.input.activePointer, 500, 500, 500);

            if (player1.health <= 0) {
                player1.kill();
                p1Bullets.kill();
                var style = {font: "35px Verdana", fill: "#ff6f6b", align: "center"};
                var text = game.add.text(game.world.centerX, game.world.centerY, "P2 Victory!", style);
            } else {
                player2.kill();
                p2Bullets.kill();
                var style = {font: "35px Verdana", fill: "#c3b6ff", align: "center"};
                var text = game.add.text(game.world.centerX, game.world.centerY, "P1 Victory!", style);
            }
            text.anchor.setTo(0.5, 0.5);

        }

    }

    function bulletCollide(player, bullet) {
        // Remove bullet from game
        bullet.kill();

        // Lower HP of hit player
        player.health -= 1;

        // Play explosion SFX on death
        if (player.health == 0){
            explosionFX.play();
        }

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

    function fireBulletP1() {
        if (game.time.now > p1BulletTime) {
            bullet = p1Bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(player1.body.x + 22, player1.body.y + 24);
                bullet.lifespan = 2500;
                bullet.rotation = player1.rotation;
                game.physics.arcade.velocityFromRotation(player1.rotation, bulletVelocity, bullet.body.velocity);
                p1BulletTime = game.time.now + fireRate;
                }
            }
    }

    function fireBulletP2() {
        if (game.time.now > p2BulletTime) {
            bullet = p2Bullets.getFirstExists(false);

            if (bullet) {
                bullet.reset(player2.body.x + 22, player2.body.y + 24);
                bullet.lifespan = 2500;
                bullet.rotation = player2.rotation;
                game.physics.arcade.velocityFromRotation(player2.rotation, bulletVelocity, bullet.body.velocity);
                p2BulletTime = game.time.now + fireRate;
            }
        }
    }

};
