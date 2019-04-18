"use strict";

GameStates.makeGame = function (game, shared) {

    // Map elements
    var map;
    var background;
    var sun;
    var platforms;
    var ground;
    var floatingPlatform;
    var movingPlatforms;

    var part;

    var player;

    var baconBits;
    var i;
    var returnedBits = 0;

    // Boolean for currently following
    var bitsFollowing = [0, 0, 0, 0, 0, 0];

    var baconPath = new Array();

    // How long until the bits follow your actions
    var baconSpacer = 12;


    var time;
    var timeLeft;
    var timeText;


    var pan;

    var input;

    var grounded;
    var movingGrounded;

    var bitGrounded = [0, 0, 0, 0, 0, 0];
    var bitMovingGrounded = [0, 0, 0, 0, 0, 0];

    var sizzle;
    var yay;


    // Physics variables for tweaking
    var globalGravity = 500;
    var jumpTimer = 0;
    var jTimerBacon = [0, 0, 0, 0, 0, 0];

    var dashTimer = 0;
    var dTimerBacon = [0, 0, 0, 0, 0, 0];

    var MOVESPEED = 175;
    var JUMPLENGTH = 600;
    var JUMPVELOCITY = 400;
    var DASHLENGTH = 2000;
    var DASHVELOCITY = 400;
    var SKIDRATE = 1.25;

    function quitGame() {

        //  Here you should destroy anything you no longer need.
        //  Stop music, delete sprites, purge caches, free resources, all that good stuff.

        //  Then let's go back to the main menu.
        returnedBits = 0;
        sizzle.stop();


        game.state.start('MainMenu');


    }

    return {

        create: function () {

            this.game.physics.startSystem(Phaser.Physics.ARCADE);

            this.game.world.setBounds(0, 0, 3200, 600);


            // Background elements set up
            background = this.game.add.sprite(0, 0, 'background');
            sun = this.game.add.sprite(game.world.centerX + 190, game.world.centerY - 300, 'sun_anim');
            sun.animations.add('wait', [0, 1, 2], 6, true);
            sun.play('wait');

            // Platforms & ground set up
            platforms = game.add.group();
            platforms.enableBody = true;
            ground = platforms.create(640, game.world.height - 48, 'ground');
            ground.scale.setTo(4, 1.8);
            ground.body.immovable = true;
            ground = platforms.create(1040, game.world.height - 48, 'ground');
            ground.scale.setTo(24, 1.8);
            ground.body.immovable = true;
            ground = platforms.create(2800, game.world.height - 48, 'ground');
            ground.scale.setTo(24, 1.8);
            ground.body.immovable = true;


            floatingPlatform = platforms.create(400, 400, 'ground');
            floatingPlatform.body.immovable = true;
            floatingPlatform.scale.setTo(6, 1);
            floatingPlatform = platforms.create(150, 100, 'ground');
            floatingPlatform.body.immovable = true;
            floatingPlatform.scale.setTo(2, 1);
            floatingPlatform = platforms.create(game.world.centerX, 140, 'ground');
            floatingPlatform.body.immovable = true;
            floatingPlatform.scale.setTo(3, 1);
            floatingPlatform = platforms.create(game.world.centerX - 200, 160, 'ground');
            floatingPlatform.body.immovable = true;
            floatingPlatform.scale.setTo(3, 1);
            floatingPlatform = platforms.create(game.world.centerX - 400, 180, 'ground');
            floatingPlatform.body.immovable = true;
            floatingPlatform.scale.setTo(3, 1);
            floatingPlatform = platforms.create(game.world.centerX - 600, 200, 'ground');
            floatingPlatform.body.immovable = true;
            floatingPlatform.scale.setTo(3, 1);
            floatingPlatform = platforms.create(game.world.centerX + 600, 200, 'ground');
            floatingPlatform.body.immovable = true;
            floatingPlatform.scale.setTo(1, 1);
            floatingPlatform = platforms.create(game.world.centerX + 1150, 175, 'ground');
            floatingPlatform.body.immovable = true;
            floatingPlatform.scale.setTo(4, 1);


            // Set up moving platforms
            movingPlatforms = this.game.add.group();
            movingPlatforms.enableBody = true;

            movingPlatforms.create(200, 250, 'ground');
            movingPlatforms.children[0].body.immovable = true;
            movingPlatforms.children[0].scale.setTo(5, 1);
            movingPlatforms.children[0].body.velocity.x = 100;

            movingPlatforms.create(game.world.centerX - 600, 350, 'ground');
            movingPlatforms.children[1].body.immovable = true;
            movingPlatforms.children[1].scale.setTo(3, 1);
            movingPlatforms.children[1].body.velocity.x = 130;

            movingPlatforms.create(game.world.centerX + 400, 300, 'ground');
            movingPlatforms.children[2].body.immovable = true;
            movingPlatforms.children[2].scale.setTo(4, 1);
            movingPlatforms.children[2].body.velocity.x = 180;

            movingPlatforms.create(game.world.centerX + 1000, 550, 'ground');
            movingPlatforms.children[3].body.immovable = true;
            movingPlatforms.children[3].scale.setTo(3, 1);
            movingPlatforms.children[3].body.velocity.x = 100;


            // Goal object
            pan = game.add.sprite(game.world.centerX, 495, 'pan_anim');
            pan.scale.setTo(0.4, 0.4);
            game.physics.enable(pan, Phaser.Physics.ARCADE);
            pan.body.immovable = true;
            pan.animations.add('fire1', [0, 1, 2], 10, true);
            pan.animations.add('fire2', [3, 4, 5], 10, true);
            pan.animations.add('fire3', [6, 7, 8], 10, true);
            sizzle = this.game.add.audio('sizzle');


            // Bacon bits set up
            baconBits = this.game.add.group();

            for (i = 0; i < 6; i++) {
                baconBits.create(0, 0, 'bacon bits', i);
            }

            for (i = 0; i < baconBits.children.length; i++) {
               // baconBits.children[i].scale.setTo(0.045, 0.045);
                baconBits.children[i].anchor.setTo(0.5, 0.5);
                this.game.physics.enable(baconBits.children[i], Phaser.Physics.ARCADE);
                baconBits.children[i].body.gravity.y = globalGravity;
                baconBits.children[i].setHealth(0);
                //baconBits.children[i].body.collideWorldBounds = true;
                //baconBits.children[i].body.checkCollision.up = false;
                baconBits.children[i].animations.add('wait', [0, 1], 5, true);
                baconBits.children[i].animations.add('run', [2, 3], 8, true);
                baconBits.children[i].play('wait');
            }

            baconBits.children[0].position.set(game.world.centerX - 150, 400);
            baconBits.children[1].position.set(400, 20);
            baconBits.children[2].position.set(game.world.centerX + 50, 50);
            baconBits.children[3].position.set(150, 50);
            baconBits.children[4].position.set(game.world.centerX + 600, 50);
            baconBits.children[5].position.set(game.world.centerX + 1150, 50);

            yay = this.game.add.audio('yay');










            // Player set up
            player = game.add.sprite(game.world.centerX, game.world.centerY, 'bacon');
            player.scale.setTo(0.17, 0.17);
            player.anchor.setTo(0.5, 0.5);

            game.camera.follow(player);

            game.physics.enable(player, Phaser.Physics.ARCADE);
            player.body.gravity.y = globalGravity;

            //player.animations.add('deal with it', [1], 1, true);
            player.animations.add('wait', [0, 1, 2], 10, true);
            player.animations.add('runRight', [3, 4], 10, true);
            player.animations.add('runLeft', [5, 6], 10, true);



            // Game input
            input = game.input.keyboard.addKeys({
                'up': Phaser.KeyCode.UP,
                'down': Phaser.KeyCode.DOWN,
                'left': Phaser.KeyCode.LEFT,
                'right': Phaser.KeyCode.RIGHT,
                'jump': Phaser.KeyCode.SPACEBAR,
                'dash': Phaser.KeyCode.Q,
                'throw': Phaser.KeyCode.E,
            });



            // Follower mechanics
            for (i = 0; i <= baconBits.children.length * baconSpacer; i++) {
                //baconPath[i] = new Phaser.Point(player.x, player.y);
                baconPath[i] = input;
            }


            // Clock set up
            var style = {font: "28px Verdana", fill: "#ff476f", align: "center"};
            timeText = game.add.text(game.world.centerX, 15, "Collect All Your Friends!", style);
            timeText.anchor.setTo(0.5, 0.0);
            time = game.time.now;





        },

        update: function () {

            timeLeft = 99999 - (game.time.now - time);
            timeText.text = "Time remaining: " + timeLeft;


            // Platform collision
            grounded = game.physics.arcade.collide(player, platforms);

            for (i = 0; i < baconBits.children.length; i++) {
                bitGrounded[i] = game.physics.arcade.collide(baconBits.children[i], platforms);
            }


            // Moving plat collision
            movingGrounded = game.physics.arcade.collide(player, movingPlatforms);

            for (i = 0; i < baconBits.children.length; i++) {
                bitMovingGrounded[i] = game.physics.arcade.collide(baconBits.children[i], movingPlatforms);
            }

            // Goal collision
            game.physics.arcade.collide(baconBits, pan, cookBacon);


            // Overlap detection for picking up followers
            for (i = 0; i < baconBits.children.length; i++) {
                if (checkOverlap(player, baconBits.children[i])) {
                    activateFollower(player, baconBits.children[i]);
                }
            }


            // Movement & follower update chain
            playerMovement(player, input);


            // Platform cycles
            if (movingPlatforms.children[0].x < 0) {
                movingPlatforms.children[0].body.velocity.x = 100;
            } else if (movingPlatforms.children[0].x > 600) {
                movingPlatforms.children[0].body.velocity.x = -100;
            }

            if (movingPlatforms.children[1].x < game.world.centerX - 960) {
                movingPlatforms.children[1].body.velocity.x = 130;
            } else if (movingPlatforms.children[1].x > game.world.centerX + 50) {
                movingPlatforms.children[1].body.velocity.x = -130;
            }

            if (movingPlatforms.children[2].x < game.world.centerX + 250) {
                movingPlatforms.children[2].body.velocity.x = 180;
            } else if (movingPlatforms.children[2].x > game.world.centerX + 950) {
                movingPlatforms.children[2].body.velocity.x = -180;
            }

            if (movingPlatforms.children[3].x < game.world.centerX + 250) {
                movingPlatforms.children[3].body.velocity.x = 100;
            } else if (movingPlatforms.children[3].x > game.world.centerX + 1000) {
                movingPlatforms.children[3].body.velocity.x = -100;
            }


            // Update follower chain
            /*
                        if (player.velocity != 0){
                            var part = baconPath.pop();
                            part.setTo(player.x, player.y);
                            baconPath.unshift(part);

                            for (i = 0; i < baconBits.children.length; i++) {
                                if (baconBits.children[i].health >= 2){
                                    baconBits.children[i].x = (baconPath[(i+1) * baconSpacer]).x;
                                    //if (!grounded){
                                        baconBits.children[i].y = (baconPath[(i+1) * baconSpacer]).y +18;
                                    //}

                                }

                            }
                        }
            */

            // Victory check
            if (returnedBits == baconBits.children.length) {
                sun.scale.setTo(3, 3);
                sun.x -= 1
                //player.play('deal with it');
                timeText.text = "Sizzle sizzle! More levels in the future.\nClick on Bacon to return."
                player.inputEnabled = true;
                player.events.onInputDown.add(function () {
                    quitGame();
                }, this);
            }

            // Time failure check
            if ((timeLeft <= 0) && (returnedBits < baconBits.children.length)) {
                timeText.text = "Out of time!\nClick on Bacon to return.";
                player.inputEnabled = true;
                player.events.onInputDown.add(function () {
                    quitGame();
                }, this);
                returnedBits = 0;
                sizzle.stop();
            }


            // Death check
            if (player.y > (game.height + 100)) {
                returnedBits = 0;
                timeText.text = "Game Over!";
                time = game.time.now;
                sizzle.stop();
                this.state.start('Stage1');

            }

        },

        render: function () {

        }

    };

    // Handles keyboard input mapping for movement
    function playerMovement(player, playerInput) {
        if (playerInput.left.isDown) {
            // Move the player left
            player.body.velocity.x = -(MOVESPEED);
            player.play('runLeft');

        } else if (playerInput.right.isDown) {
            // Move the player right
            player.body.velocity.x = MOVESPEED;
            player.play('runRight');

        } else {
            // Decay velocity until standstill
            player.body.velocity.x = player.body.velocity.x / SKIDRATE;
            player.play('wait');

        }

        // Jumping
        if (playerInput.up.isDown && (grounded || movingGrounded) && (player.body.velocity.y == 0)) {
            jumpTimer = game.time.now + JUMPLENGTH;
            player.body.velocity.y = -(JUMPVELOCITY);
        } else if (playerInput.up.isDown && (jumpTimer != 0)) {
            if (jumpTimer > game.time.now) {
                jumpTimer = 0;
            } else {
                player.body.velocity = -(JUMPVELOCITY);
            }
        } else if (jumpTimer != 0) {
            jumpTimer = 0;
        }


        // Dashing
        if (playerInput.dash.isDown && dashTimer == 0) {
            dashTimer = game.time.now + DASHLENGTH;
            player.body.velocity.x = -(DASHVELOCITY);
        } else if (playerInput.up.isDown && (dashTimer != 0)) {
            if (dashTimer > game.time.now) {
                dashTimer = 0;
            } else {
                player.body.velocity = -(DASHVELOCITY);
            }
        } else if (dashTimer != 0) {
            dashTimer = 0;
        }


        // Throwing


        // Adding inputs to queue for followers
        /*
            'up': Phaser.KeyCode.UP,
            'down': Phaser.KeyCode.DOWN,
            'left': Phaser.KeyCode.LEFT,
            'right': Phaser.KeyCode.RIGHT,
            'jump': Phaser.KeyCode.SPACEBAR,
            'dash': Phaser.KeyCode.Q,
            'throw': Phaser.KeyCode.E,
        */

        part = baconPath.pop();
        part = playerInput;
        baconPath.unshift(part);

        for (i = 0; i < baconBits.children.length; i++) {
            if (baconBits.children[i].health >= 2) {
                followerInputChain(baconBits.children[i], baconPath[(i + 1) * baconSpacer], i);
            }
        }


    }


    function followerInputChain(baconBit, playerInput, i) {

        if (playerInput.left.isDown) {
            // Move the player left
            baconBit.body.velocity.x = -(MOVESPEED);
            baconBit.play('run');

        } else if (playerInput.right.isDown) {
            // Move the player right
            baconBit.body.velocity.x = MOVESPEED;
            player.play('run');

        } else {
            // Decay velocity until standstill
            baconBit.body.velocity.x = baconBit.body.velocity.x / SKIDRATE;
            player.play('wait');

        }

        // Jumping
        if (playerInput.up.isDown && (bitGrounded || bitMovingGrounded) && (baconBit.body.velocity.y == 0)) {
            jumpTimer = game.time.now + JUMPLENGTH;
            baconBit.body.velocity.y = -(JUMPVELOCITY);
        } else if (playerInput.up.isDown && (jTimerBacon[i] != 0)) {
            if (jumpTimer > game.time.now) {
                jumpTimer = 0;
            } else {
                baconBit.body.velocity = -(JUMPVELOCITY);
            }
        } else if (jTimerBacon[i] != 0) {
            jumpTimer = 0;
        }

    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    }

    function activateFollower(player, baconBit) {
        // Increase health (used for completion tracking)
        if (baconBit.health <= 1) {
            baconBit.health += 1;

            //baconBit.body.x = player.body.x;
            //baconBit.body.y = player.body.y;

            if (timeLeft < 99990) {
                yay.play();
            }
        }
    }

    function cookBacon(thepan, baconBit) {
        baconBit.health = 0;
        baconBit.kill();
        returnedBits += 1;

        if (returnedBits > 4) {
            thepan.play('fire3');
        } else if (returnedBits > 2) {
            thepan.play('fire2');
        } else if (returnedBits > 0) {
            thepan.play('fire1');
            sizzle.play();
        }


    }

};
