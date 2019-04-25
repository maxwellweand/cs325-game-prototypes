"use strict";

GameStates.makeGame2 = function (game, shared) {

    // Map elements
    var map;
    var background;
    var sun;
    var platforms;
    var ground;
    var floatingPlatform;
    var movingPlatforms;

    // Truth values of input isDown
    var inputArray = [false, false, false, false, false, false, false];
    var newInput = [false, false, false, false, false, false, false];

    var frameTimer;

    var jumpReference;


    var baconPath = new Array();

    var stageComplete = false;

    var player;

    var baconBits;
    var i;
    var returnedBits = 0;


    var inputHistory = new Array();

    // How long until the bits follow your actions
    var baconSpacer = 12;


    var time;
    var timeLeft;
    var timeText;


    var pan;

    var input;


    var sizzle;
    var yay;


    // Physics variables for tweaking
    var globalGravity = 500;


    var MOVESPEED = 175;
    var JUMPLENGTH = 600;
    var JUMPVELOCITY = 450;
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

            this.game.world.setBounds(0, 0, 1000, 6400);


            /************************
             * BACKGROUND ELEMENTS
             ***********************/
            {
                background = this.game.add.sprite(0, 0, 'background2');
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
                ground = platforms.create(game.world.width - 1300, game.world.height - 48, 'ground');
                ground.scale.setTo(45, 1.8);
                ground.body.immovable = true;


                floatingPlatform = platforms.create(game.world.centerX - 300, game.world.height - 250, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(6, 1);
                floatingPlatform = platforms.create(game.world.centerX + 150, game.world.height - 400, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(5, 1);

                floatingPlatform = platforms.create(game.world.centerX + 400, game.world.height - 500, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(3, 1);

                floatingPlatform = platforms.create(game.world.centerX + 150, game.world.height - 650, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1, 1);

                floatingPlatform = platforms.create(game.world.centerX + 400, game.world.height - 800, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1, 1);

                floatingPlatform = platforms.create(game.world.centerX + 150, game.world.height - 950, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1, 1);

                floatingPlatform = platforms.create(game.world.centerX + 400, game.world.height - 1100, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(3, 1);

                // Plat with the baconbit(1)
                floatingPlatform = platforms.create(game.world.centerX - 100, game.world.height - 1100, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1, 1);

                // Side Path
                {
                    floatingPlatform = platforms.create(game.world.centerX + 450, game.world.height - 1300, 'ground');
                    floatingPlatform.body.immovable = true;
                    floatingPlatform.scale.setTo(1, 1);

                    floatingPlatform = platforms.create(game.world.centerX + 350, game.world.height - 1500, 'ground');
                    floatingPlatform.body.immovable = true;
                    floatingPlatform.scale.setTo(1, 1);

                    floatingPlatform = platforms.create(game.world.centerX + 450, game.world.height - 1700, 'ground');
                    floatingPlatform.body.immovable = true;
                    floatingPlatform.scale.setTo(1, 1);

                    floatingPlatform = platforms.create(game.world.centerX + 250, game.world.height - 1900, 'ground');
                    floatingPlatform.body.immovable = true;
                    floatingPlatform.scale.setTo(5, 1);

                }


                floatingPlatform = platforms.create(game.world.centerX - 350, game.world.height - 1250, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1, 1);

                floatingPlatform = platforms.create(game.world.centerX - 500, game.world.height - 1400, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1, 1);

                floatingPlatform = platforms.create(game.world.centerX - 300, game.world.height - 1550, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(3, 1);

                floatingPlatform = platforms.create(game.world.centerX - 480, game.world.height - 1750, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(6, 1);

                floatingPlatform = platforms.create(game.world.centerX - 480, game.world.height - 1950, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(3, 1);

                floatingPlatform = platforms.create(game.world.centerX - 480, game.world.height - 2150, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(2, 1);

                floatingPlatform = platforms.create(game.world.centerX - 480, game.world.height - 2350, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1, 1);

                floatingPlatform = platforms.create(game.world.centerX - 380, game.world.height - 2550, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(10, 1);


                floatingPlatform = platforms.create(game.world.centerX + 300, game.world.height - 2550, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(10, 1);

                floatingPlatform = platforms.create(game.world.centerX + 350, game.world.height - 2725, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(3, 1);

                floatingPlatform = platforms.create(game.world.centerX + 400, game.world.height - 2900, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(2, 1);

                floatingPlatform = platforms.create(game.world.centerX + 450, game.world.height - 3080, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1, 1);

                // Halfway point
                floatingPlatform = platforms.create(game.world.centerX - 450, game.world.height - 3250, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(20, 1);


                floatingPlatform = platforms.create(game.world.centerX - 450, game.world.height - 3375, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(2.0, 1);
                floatingPlatform = platforms.create(game.world.centerX - 150, game.world.height - 3500, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1.9, 1);
                floatingPlatform = platforms.create(game.world.centerX + 150, game.world.height - 3625, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1.8, 1);
                floatingPlatform = platforms.create(game.world.centerX + 350, game.world.height - 3750, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1.7, 1);
                floatingPlatform = platforms.create(game.world.centerX, game.world.height - 3875, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1.6, 1);
                floatingPlatform = platforms.create(game.world.centerX - 200, game.world.height - 4000, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1.5, 1);
                floatingPlatform = platforms.create(game.world.centerX - 320, game.world.height - 4125, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1.4, 1);
                floatingPlatform = platforms.create(game.world.centerX + 100, game.world.height - 4250, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1.3, 1);
                floatingPlatform = platforms.create(game.world.centerX - 450, game.world.height - 4250, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1.1, 1);

                // Bacon Bit
                floatingPlatform = platforms.create(game.world.centerX - 250, game.world.height - 4425, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(5, 1);

                floatingPlatform = platforms.create(game.world.centerX + 350, game.world.height - 4425, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(1.0, 1);

                floatingPlatform = platforms.create(game.world.centerX + 450, game.world.height - 4550, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(0.9, 1);

                floatingPlatform = platforms.create(game.world.centerX, game.world.height - 4738, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(7, 1);


                floatingPlatform = platforms.create(game.world.centerX - 400, game.world.height - 4600, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(0.8, 1);
                floatingPlatform = platforms.create(game.world.centerX - 425, game.world.height - 4775, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(0.7, 1);
                floatingPlatform = platforms.create(game.world.centerX - 450, game.world.height - 4965, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(0.6, 1);
                floatingPlatform = platforms.create(game.world.centerX - 475, game.world.height - 5140, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(0.5, 1);
                floatingPlatform = platforms.create(game.world.centerX - 500, game.world.height - 5300, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(0.4, 1);
                floatingPlatform = platforms.create(game.world.centerX - 350, game.world.height - 5450, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(0.3, 1);
                floatingPlatform = platforms.create(game.world.centerX - 300, game.world.height - 5630, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(0.2, 1);
                floatingPlatform = platforms.create(game.world.centerX - 410, game.world.height - 5800, 'ground');
                floatingPlatform.body.immovable = true;
                floatingPlatform.scale.setTo(0.1, 1);


                floatingPlatform = platforms.create(game.world.centerX, 100, 'ground');
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

                movingPlatforms.create(game.world.centerX - 600, 500, 'ground');
                movingPlatforms.children[1].body.immovable = true;
                movingPlatforms.children[1].scale.setTo(3, 1);
                movingPlatforms.children[1].body.velocity.x = 130;

                movingPlatforms.create(game.world.centerX + 400, 300, 'ground');
                movingPlatforms.children[2].body.immovable = true;
                movingPlatforms.children[2].scale.setTo(4, 1);
                movingPlatforms.children[2].body.velocity.x = 180;

                movingPlatforms.create(game.world.centerX + 1000, 150, 'ground');
                movingPlatforms.children[3].body.immovable = true;
                movingPlatforms.children[3].scale.setTo(3, 1);
                movingPlatforms.children[3].body.velocity.x = 100;
            }


            /************************
             * GOAL OBJECT
             ***********************/
            {
                pan = game.add.sprite(game.world.centerX - 50, game.world.height - 3315, 'pan_anim');
                pan.scale.setTo(0.4, 0.4);
                game.physics.enable(pan, Phaser.Physics.ARCADE);
                pan.body.immovable = true;
                pan.body.setSize(400, 150, 32, 48);
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
                baconBits.children[0].position.set(game.world.width - 800, game.world.height - 200);
                baconBits.children[1].position.set(game.world.centerX + 450, game.world.height - 1200,);
                baconBits.children[2].position.set(game.world.centerX + 350, game.world.height - 1945);
                baconBits.children[3].position.set(game.world.centerX - 200, game.world.height - 4475);
                baconBits.children[4].position.set(game.world.centerX + 100, game.world.height - 4858);
                baconBits.children[5].position.set(game.world.centerX + 35, 50);

                // Collection audio
                yay = this.game.add.audio('yay');
            }

            /************************
             *  PLAYER SET UP
             ***********************/
            {
                player = game.add.sprite(game.world.centerX, game.world.centerY + 100, 'bacon');
                player.scale.setTo(0.8, 0.8);
                player.anchor.setTo(0.5, 0.5);


                game.camera.follow(player);

                game.physics.enable(player, Phaser.Physics.ARCADE);
                player.body.gravity.y = globalGravity;

                player.grounded = false; // Static platform detection
                player.movingGrounded = false; // Moving platform detection

                player.jumpTimer = 0; // Timer for handling jumps
                player.dashTimer = 0; // Timer for handling dash
                player.throwTimer = 0; // Timer for handling throws


                player.body.setSize(118, 166);

                //player.animations.add('deal with it', [1], 1, true);
                player.animations.add('wait', [0, 1, 2], 10, true);
                player.animations.add('runRight', [3, 4], 10, true);
                player.animations.add('runLeft', [5, 6], 10, true);
                jumpReference = player.animations.add('jump', [7, 8, 9, 10, 11, 12], 10, false);
                player.animations.add('falling', [11, 12], 10, true);
            }

            /************************
             *  CLOCK SET UP
             ***********************/
            {
                var style = {font: "28px Verdana", fill: "#ff476f", align: "center"};
                timeText = game.add.text(game.world.centerX, game.world.centerY, "Collect All Your Friends!", style);
                timeText.anchor.setTo(0.5, 0.0);
                time = game.time.now;
            }


            /************************
             *  GAME INPUT
             ***********************/
            input = game.input.keyboard.addKeys({
                'up': Phaser.KeyCode.UP, // 0
                'down': Phaser.KeyCode.DOWN, // 1
                'left': Phaser.KeyCode.LEFT, // 2
                'right': Phaser.KeyCode.RIGHT, // 3
                'jump': Phaser.KeyCode.SPACEBAR, // 4
                'dash': Phaser.KeyCode.Q, // 5
                'throw': Phaser.KeyCode.E, // 6
            });


            /*********************************
             *  Populate input history array
             *********************************/
            for (i = 0; i <= baconBits.children.length * baconSpacer; i++) {
                //inputHistory[i] = inputArray;
                baconPath[i] = new Phaser.Point(player.x, player.y);
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

                if (timeLeft < 333330) {

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
            {
                // Update input array with current input values
                updateInputArray(input);

                // Player movement with current input state
                unitMovement(player, inputArray);

                // Separate block for throwing bacon bits
                if (input.throw.isDown && (player.dashTimer != 0)) {

                }

                /*
                            // Throw away oldest input
                            inputHistory.pop();
                            // Clone current input to new input
                            for (i = 0; i < inputArray.length; i++) {
                                newInput[i] = inputArray[i];
                            }
                            // Queue new input
                            inputHistory.unshift(newInput);
                */


                // Hotfix janky follower alg
                var part = baconPath.pop();
                part.setTo(player.x, player.y);
                baconPath.unshift(part);

                if (timeLeft < 333330) {
                    for (i = 0; i < baconBits.children.length; i++) {
                        if (baconBits.children[i].following == true) {
                            // unitMovement(baconBits.children[i], inputHistory[(i + 1) * baconSpacer]);
                            baconBits.children[i].x = (baconPath[(i + 1) * baconSpacer]).x;
                            baconBits.children[i].y = (baconPath[(i + 1) * baconSpacer]).y + 18;
                        }
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
            {

                // Victory check
                if (returnedBits == baconBits.children.length) {
                    sun.scale.setTo(3, 3);
                    sun.x -= 1
                    //player.play('deal with it');
                    stageComplete = true;
                    timeText.text = "Sizzle sizzle! More levels in the future.\nClick on Bacon to return."
                    player.inputEnabled = true;
                    player.events.onInputDown.add(function () {
                        quitGame();
                    }, this);
                }

                // Time failure check
                if ((timeLeft <= 0) && (!stageComplete)) {
                    timeText.text = "Out of time!\nClick on Bacon to return.";
                    player.inputEnabled = true;
                    player.events.onInputDown.add(function () {
                        quitGame();
                    }, this);
                    player.x = game.world.centerX;
                    player.y = game.world.centerY;
                    returnedBits = 0;
                    sizzle.stop();
                } else if (!stageComplete) {
                    // Update time counter
                    timeLeft = 333333 - (game.time.now - time);
                    timeText.text = "Time remaining: " + timeLeft;
                }

                /*
                            // Death check
                            if (player.y > (game.height + 100)) {
                                returnedBits = 0;
                                timeText.text = "Game Over!";
                                time = game.time.now;
                                sizzle.stop();
                                this.state.start('Stage2');

                            }
                */
            }
        },

        render: function () {

        }

    };

    // Handles keyboard input mapping for movement
    function unitMovement(player, playerInput) {

        if (playerInput[2]) { // If input.left.isDown
            // Move the player left
            player.body.velocity.x = -(MOVESPEED);
            if ((player.grounded || player.movingGrounded)) {
                player.play('runLeft');
            }


        } else if (playerInput[3]) { // If input.right.isDown
            // Move the player right
            player.body.velocity.x = MOVESPEED;
            if ((player.grounded || player.movingGrounded)) {
                player.play('runRight');
            }

        } else {
            // Decay velocity until standstill
            player.body.velocity.x = player.body.velocity.x / SKIDRATE;
            if ((player.grounded || player.movingGrounded)) {
                player.play('wait');
            }
        }


        // Jumping
        if (playerInput[0] && (player.grounded || player.movingGrounded) && (player.body.velocity.y == 0)) { // If input.up.isDown
            player.jumpTimer = game.time.now + JUMPLENGTH;
            player.body.velocity.y = -(JUMPVELOCITY);
            player.play('jump');
        } else if (playerInput[0] && (player.jumpTimer != 0)) { // If input.up.isDown
            if (player.jumpTimer > game.time.now) {
                player.jumpTimer = 0;
            } else {
                player.body.velocity = -(JUMPVELOCITY);
            }
        } else if (player.jumpTimer != 0) {
            player.jumpTimer = 0;
        }

        // Play falling animation
        if (!(player.grounded || player.movingGrounded)) {
            if (!jumpReference.isPlaying) {
                player.play('falling');
            }
        }

        // Dashing
        if (playerInput[5] && player.dashTimer == 0) { // If input.dash.isDown
            player.dashTimer = game.time.now + DASHLENGTH;
            player.body.velocity.y = -(DASHVELOCITY);
        } else if (playerInput[5] && (player.dashTimer != 0)) { // If input.dash.isDown
            if (player.dashTimer > game.time.now) {
                player.dashTimer = 0;
            } else {
                player.body.velocity = -(DASHVELOCITY);
            }
        } else if (player.dashTimer != 0) {
            player.dashTimer = 0;
        }


    }

// Update input array with current input values
    function updateInputArray(input) {
        if (input.up.isDown) {
            inputArray[0] = true;
        } else {
            inputArray[0] = false;
        }

        if (input.down.isDown) {
            inputArray[1] = true;
        } else {
            inputArray[1] = false;
        }

        if (input.left.isDown) {
            inputArray[2] = true;
        } else {
            inputArray[2] = false;
        }

        if (input.right.isDown) {
            inputArray[3] = true;
        } else {
            inputArray[3] = false;
        }

        if (input.jump.isDown) {
            inputArray[4] = true;
        } else {
            inputArray[4] = false;
        }

        if (input.dash.isDown) {
            inputArray[5] = true;
        } else {
            inputArray[5] = false;
        }

        if (input.throw.isDown) {
            inputArray[6] = true;
        } else {
            inputArray[6] = false;
        }
    }

// Updates positions of moving platforms
    function platformCycleUpdate() {

        if (movingPlatforms.children[0].x < 0) {
            movingPlatforms.children[0].body.velocity.x = 100;
        } else if (movingPlatforms.children[0].x > 600) {
            movingPlatforms.children[0].body.velocity.x = -100;
        }

        if (movingPlatforms.children[1].x < game.world.centerX - 400) {
            movingPlatforms.children[1].body.velocity.x = 130;
        } else if (movingPlatforms.children[1].x > game.world.centerX + 50) {
            movingPlatforms.children[1].body.velocity.x = -130;
        }

        if (movingPlatforms.children[2].x < game.world.centerX + 150) {
            movingPlatforms.children[2].body.velocity.x = 180;
        } else if (movingPlatforms.children[2].x > game.world.centerX + 350) {
            movingPlatforms.children[2].body.velocity.x = -180;
        }

        if (movingPlatforms.children[3].x < game.world.centerX + 250) {
            movingPlatforms.children[3].body.velocity.x = 100;
        } else if (movingPlatforms.children[3].x > game.world.centerX + 400) {
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
        }

        sizzle.play();

    }

}
;
