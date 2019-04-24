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

    var newInput;

    var player;

    var baconBits;
    var i;
    var returnedBits = 0;

    // Boolean for currently following
    var bitsFollowing = [0, 0, 0, 0, 0, 0];

    var inputHistory = new Array();

    // How long until the bits follow your actions
    var baconSpacer = 12;


    var time;
    var timeLeft;
    var timeText;


    var pan;

    var input;

    //var grounded;
    //var movingGrounded;
    //var bitGrounded = [0, 0, 0, 0, 0, 0];
    //var bitMovingGrounded = [0, 0, 0, 0, 0, 0];

    var sizzle;
    var yay;


    // Physics variables for tweaking
    var globalGravity = 500;

    //var jumpTimer = 0;
    //var jTimerBacon = [0, 0, 0, 0, 0, 0];
    //var dashTimer = 0;
    //var dTimerBacon = [0, 0, 0, 0, 0, 0];

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


            /************************
             * BACKGROUND ELEMENTS
             ***********************/
            {
                background = this.game.add.sprite(0, 0, 'background');
                sun = this.game.add.sprite(game.world.centerX + 190, game.world.centerY - 300, 'sun_anim');
                sun.animations.add('wait', [0, 1, 2], 6, true);
                sun.play('wait');
            }

            /************************
             * PLATFORMS & GROUND SET UP
             ***********************/
            {
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
            }

            /************************
             * MOVING PLATFORMS SET UP
             ***********************/
            {
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
            }


            /************************
             * GOAL OBJECT
             ***********************/
            {
                pan = game.add.sprite(game.world.centerX, 495, 'pan_anim');
                pan.scale.setTo(0.4, 0.4);
                game.physics.enable(pan, Phaser.Physics.ARCADE);
                pan.body.immovable = true;
                pan.animations.add('fire1', [0, 1, 2], 10, true);
                pan.animations.add('fire2', [3, 4, 5], 10, true);
                pan.animations.add('fire3', [6, 7, 8], 10, true);
                sizzle = this.game.add.audio('sizzle');
            }

            /************************
             * BACON BITS SET UP
             ***********************/
            {
                baconBits = this.game.add.group();

                for (i = 0; i < 6; i++) {
                    baconBits.create(0, 0, 'bacon bits', i);
                }

                for (i = 0; i < baconBits.children.length; i++) {
                    // baconBits.children[i].scale.setTo(0.045, 0.045);
                    baconBits.children[i].anchor.setTo(0.5, 0.5);
                    this.game.physics.enable(baconBits.children[i], Phaser.Physics.ARCADE);
                    baconBits.children[i].body.gravity.y = globalGravity;

                    baconBits.children[i].following = false;
                    baconBits.children[i].grounded = false; // Static platform detection
                    baconBits.children[i].movingGrounded = false; // Moving platform detection

                    baconBits.children[i].jumpTimer = 0; // Timer for handling jumps
                    baconBits.children[i].dashTimer = 0; // Timer for handling dash

                    //baconBits.children[i].body.collideWorldBounds = true;
                    //baconBits.children[i].body.checkCollision.up = false;

                    baconBits.children[i].animations.add('wait', [0, 1], 5, true);
                    baconBits.children[i].animations.add('run', [2, 3], 8, true);
                    baconBits.children[i].play('wait');
                }

                // Set position of bacon bits
                baconBits.children[0].position.set(game.world.centerX - 150, 400);
                baconBits.children[1].position.set(400, 20);
                baconBits.children[2].position.set(game.world.centerX + 50, 50);
                baconBits.children[3].position.set(150, 50);
                baconBits.children[4].position.set(game.world.centerX + 600, 50);
                baconBits.children[5].position.set(game.world.centerX + 1150, 50);

                // Collection audio
                yay = this.game.add.audio('yay');
            }

            /************************
             *  PLAYER SET UP
             ***********************/
            {
                player = game.add.sprite(game.world.centerX, game.world.centerY, 'bacon');
                player.scale.setTo(0.17, 0.17);
                player.anchor.setTo(0.5, 0.5);

                game.camera.follow(player);

                game.physics.enable(player, Phaser.Physics.ARCADE);
                player.body.gravity.y = globalGravity;

                player.grounded = false; // Static platform detection
                player.movingGrounded = false; // Moving platform detection

                player.jumpTimer = 0; // Timer for handling jumps
                player.dashTimer = 0; // Timer for handling dash
                player.throwTimer = 0; // Timer for handling throws


                //player.animations.add('deal with it', [1], 1, true);
                player.animations.add('wait', [0, 1, 2], 10, true);
                player.animations.add('runRight', [3, 4], 10, true);
                player.animations.add('runLeft', [5, 6], 10, true);
            }

            /************************
             *  CLOCK SET UP
             ***********************/
            {
                var style = {font: "28px Verdana", fill: "#ff476f", align: "center"};
                timeText = game.add.text(game.world.centerX, 15, "Collect All Your Friends!", style);
                timeText.anchor.setTo(0.5, 0.0);
                time = game.time.now;
            }


            /************************
             *  GAME INPUT
             ***********************/
            input = game.input.keyboard.addKeys({
                'up': Phaser.KeyCode.UP,
                'down': Phaser.KeyCode.DOWN,
                'left': Phaser.KeyCode.LEFT,
                'right': Phaser.KeyCode.RIGHT,
                'jump': Phaser.KeyCode.SPACEBAR,
                'dash': Phaser.KeyCode.Q,
                'throw': Phaser.KeyCode.E,
            });


            /*********************************
             *  Populate input history array
             *********************************/
            for (i = 0; i <= baconBits.children.length * baconSpacer; i++) {
                inputHistory[i] = input;
            }


        },

        update: function () {

            /*************************
             * COLLISION BLOCK
             *************************/
            {
                // Platform collision
                player.grounded = game.physics.arcade.collide(player, platforms);
                player.movingGrounded = game.physics.arcade.collide(player, movingPlatforms);

                // Moving plat collision
                for (i = 0; i < baconBits.children.length; i++) {
                    baconBits.children[i].grounded = game.physics.arcade.collide(baconBits.children[i], platforms);
                    baconBits.children[i].MovingGrounded = game.physics.arcade.collide(baconBits.children[i], movingPlatforms);
                }


                // Goal collision
                game.physics.arcade.collide(baconBits, pan, cookBacon);

                if (timeLeft < 99990) {

                    // Overlap detection for picking up followers
                    for (i = 0; i < baconBits.children.length; i++) {
                        if (checkOverlap(player, baconBits.children[i])) {
                            activateFollower(player, baconBits.children[i]);
                        }
                    }
                } else {
                    for (i = 0; i < baconBits.children.length; i++) {
                        baconBits.children[i].following = false;
                    }
                }

            }

            /*************************
             * MOVEMENT UPDATE BLOCK
             *************************/

            // Player movement with current input state
            unitMovement(player, input);

            // Separate block for throwing bacon bits
            if (input.throw.isDown && (player.dashTimer != 0)) {

            }

            // Throw away oldest input & queue newest input
            inputHistory.pop();
            newInput = input;
            inputHistory.unshift(newInput);


            if (timeLeft < 999990) {
                for (i = 0; i < baconBits.children.length; i++) {
                    if (baconBits.children[i].following == true) {
                        unitMovement(baconBits.children[i], inputHistory[(i + 1) * baconSpacer]);
                    }
                }
            }


            /*************************
             * STAGE UPDATE BLOCK
             *************************/

            platformCycleUpdate();


            /*************************
             * COMPLETION CHECKS
             *************************/


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
            } else {
                // Update time counter
                timeLeft = 99999 - (game.time.now - time);
                timeText.text = "Time remaining: " + timeLeft;
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
            // Nothing for now
        }

    };

    // Handles keyboard input mapping for movement
    function unitMovement(player, playerInput) {
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
        if (playerInput.up.isDown && (player.grounded || player.movingGrounded) && (player.body.velocity.y == 0)) {
            player.jumpTimer = game.time.now + JUMPLENGTH;
            player.body.velocity.y = -(JUMPVELOCITY);
        } else if (playerInput.up.isDown && (player.jumpTimer != 0)) {
            if (player.jumpTimer > game.time.now) {
                player.jumpTimer = 0;
            } else {
                player.body.velocity = -(JUMPVELOCITY);
            }
        } else if (player.jumpTimer != 0) {
            player.jumpTimer = 0;
        }


        // Dashing
        if (playerInput.dash.isDown && player.dashTimer == 0) {
            player.dashTimer = game.time.now + DASHLENGTH;
            player.body.velocity.x = -(DASHVELOCITY);
        } else if (playerInput.up.isDown && (player.dashTimer != 0)) {
            if (player.dashTimer > game.time.now) {
                player.dashTimer = 0;
            } else {
                player.body.velocity = -(DASHVELOCITY);
            }
        } else if (player.dashTimer != 0) {
            player.dashTimer = 0;
        }


    }


    // Updates positions of moving platforms
    function platformCycleUpdate() {

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
    }

    function checkOverlap(spriteA, spriteB) {

        var boundsA = spriteA.getBounds();
        var boundsB = spriteB.getBounds();

        return Phaser.Rectangle.intersects(boundsA, boundsB);
    }

    function activateFollower(player, baconBit) {
        if (baconBit.following == false) {
            baconBit.following = true;

            yay.play();
        }
    }

    function cookBacon(thepan, baconBit) {
        baconBit.following = false;
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
