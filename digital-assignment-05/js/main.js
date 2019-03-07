window.onload = function() {
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render } );
    
    function preload() {
        // Map stuff
        // load a tile map and call it 'map'.
        game.load.tilemap('map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        // load tiles for map
        game.load.image('tiles', 'assets/tileset.png');

        game.load.audio('bgm', 'assets/construction.mp3');

        // Player
        game.load.spritesheet('marshmallow_anim', 'assets/marshmallow_anim_2.png', 160, 130);


        // Glasses of Water
        game.load.image('water1', 'assets/water1.png');
        game.load.image('water2', 'assets/water2.png');
        game.load.image('water3', 'assets/water3.png');
        game.load.audio('waterPickup', 'assets/water_splash.wav');



        // Mariachi Band
        game.load.spritesheet('mariachi1_anim', 'assets/guitar.png', 500, 500);
        game.load.spritesheet('mariachi2_anim', 'assets/violin2.png', 500, 500);
        game.load.spritesheet('mariachi3_anim', 'assets/trumpet.png', 500, 500);
        game.load.audio('guitar', 'assets/guitar.mp3');
        game.load.audio('violin', 'assets/violin.mp3');
        game.load.audio('trumpet', 'assets/trumpet.mp3');
        game.load.audio('slurp', 'assets/slurp.wav');


        // Students
        // Water Fountain

    }
    // Map
    var map;
    var layer1;


    // SFX & Music
    var waterPickup;
    var slurp;
    var guitar;
    var trumpet;
    var violin;
    var bgm;

    // Key Objects
    var glasses = 0;
    var filledGlasses = 0;
    var water1;
    var water2;
    var water3;
    var water4;
    var mariachi1;
    var mariachi2;
    var mariachi3;
    var gourmet;

    // Player
    var marshmallow;
    var input;

    // Movement & physics variables for fine tuning
    var movementSpeed = 200;
    var turnSpeed = 140;




    function create() {
        // Create the map. 
        map = game.add.tilemap('map');
        map.addTilesetImage('tiles');
        // Create a layer from the map
        //using the layer name given in the .json file
        layer1 = map.createLayer('Tile Layer 1');
        //  Resize the world
        layer1.resizeWorld();

        map.setCollision(8);
        map.setCollisionBetween(10, 20, true, layer1);

        bgm = game.add.audio('bgm');
        bgm.play();



        // Player
        marshmallow = game.add.sprite ( game.world.centerX+100, game.world.centerY-250, 'marshmallow_anim');
        marshmallow.anchor.setTo (0.5, 0.5);
        game.physics.enable(marshmallow, Phaser.Physics.ARCADE);
        marshmallow.body.collideWorldBounds = true;
        game.camera.follow(marshmallow);

        // Hitbox adjustment
        marshmallow.body.setSize(120,120,20,5);
        // Scale adjustment
        marshmallow.scale.setTo(.35,.35);

        // Player animations
        marshmallow.animations.add('move', [0,1], 10, true);
        marshmallow.animations.add('rolling', [0,1], 3, true);




        // Glasses of Water
        water1 = game.add.sprite (10, 10, 'water1');
        water2 = game.add.sprite (350, 2800, 'water2');
        water3 = game.add.sprite (game.world.centerX+260, game.world.centerY, 'water3');
        water1.scale.setTo(.2,.2);
        water2.scale.setTo(.2,.2);
        water3.scale.setTo(.2,.2);
        game.physics.enable(water1, Phaser.Physics.ARCADE);
        game.physics.enable(water2, Phaser.Physics.ARCADE);
        game.physics.enable(water3, Phaser.Physics.ARCADE);
        waterPickup = game.add.audio('waterPickup');



        // Dehydrated Mariachi Band
        mariachi2 = game.add.sprite( game.world.centerX+190, game.world.centerY-420, 'mariachi2_anim');
        mariachi3 = game.add.sprite( game.world.centerX+80, game.world.centerY-430, 'mariachi3_anim');
        mariachi1 = game.add.sprite( game.world.centerX+140, game.world.centerY-400, 'mariachi1_anim');

        mariachi1.scale.setTo(.2,.2);
        mariachi2.scale.setTo(.2,.2);
        mariachi3.scale.setTo(.3,.2);

        game.physics.enable(mariachi1, Phaser.Physics.ARCADE);
        game.physics.enable(mariachi2, Phaser.Physics.ARCADE);
        game.physics.enable(mariachi3, Phaser.Physics.ARCADE);

        mariachi1.body.setSize(250,300,100,200);
        mariachi2.body.setSize(250,300,100,200);
        mariachi3.body.setSize(250,300,100,200);

        mariachi1.body.immovable = true;
        mariachi2.body.immovable = true;
        mariachi3.body.immovable = true;

        mariachi1.setHealth(1);
        mariachi2.setHealth(1);
        mariachi3.setHealth(1);



        slurp = game.add.audio('slurp');


        // Mariachi animations
        mariachi1.animations.add('play', [1,2], 10, true);
        mariachi2.animations.add('play', [1,2], 7, true);
        mariachi3.animations.add('play', [1,0,2, 0], 12, true);


        // Audio stuff
        guitar = game.add.audio('guitar');
        violin = game.add.audio('violin');
        trumpet = game.add.audio('trumpet');
        gourmet = [ guitar, violin, trumpet];
        game.sound.setDecodedCallback(gourmet, startMariachi, this);
        guitar.mute = true;
        violin.mute = true;
        trumpet.mute = true;


        // Game Input
        input = game.input.keyboard.addKeys({
            'up': Phaser.KeyCode.UP,
            'down': Phaser.KeyCode.DOWN,
            'left': Phaser.KeyCode.LEFT,
            'right': Phaser.KeyCode.RIGHT
        });

    }
    
    function update() {

        // Movement
        playerMovement(marshmallow, input);

        // Collision
        game.physics.arcade.collide(marshmallow, layer1);

        game.physics.arcade.collide(marshmallow, water1, waterCollect);
        game.physics.arcade.collide(marshmallow, water2, waterCollect);
        game.physics.arcade.collide(marshmallow, water3, waterCollect);

        game.physics.arcade.collide(marshmallow, mariachi1, collideGuitar);
        game.physics.arcade.collide(marshmallow, mariachi2, collideViolin);
        game.physics.arcade.collide(marshmallow, mariachi3, collideTrumpet);

        if (glasses == 0 && filledGlasses == 3){
            glasses = -1;
        }





    }

    function render(){

        //game.debug.body(marshmallow);
        //game.debug.body(mariachi1);


    }

    // Starts Gourmet Race
    function startMariachi(){
        guitar.loopFull(1);
        violin.loopFull(.8);
        trumpet.loopFull(.8);
    }

    // Handles keyboard input mapping for movement
    function playerMovement(player, playerInput) {
        if (playerInput.up.isDown) {
            // Accelerates the player forwards
            game.physics.arcade.velocityFromRotation(player.rotation, movementSpeed, player.body.velocity);
            player.play('move');
        } else if (playerInput.down.isDown) {
            // Accelerates the player backwards
            game.physics.arcade.velocityFromRotation(player.rotation, (movementSpeed * -1), player.body.velocity);
            player.play('move');
        } else {
            player.body.velocity.y = player.body.velocity.y / 1.3;
            player.body.velocity.x = player.body.velocity.x / 1.3;
            marshmallow.animations.stop();
        }

        // Turning
        if (playerInput.left.isDown) {
            // Rotate the player counterclockwise
            player.body.angularVelocity = -(turnSpeed);
        } else if (playerInput.right.isDown) {
            // Rotate the player clockwise
            player.body.angularVelocity = turnSpeed;
        } else {
            player.body.angularVelocity = 0;
        }

    }

    // Keeps track of glasses collected
    function waterCollect(player, water){
        // Remove glass from game
        water.kill();

        // Add to the water count
        glasses += 1;
        filledGlasses += 1; // No fountain mechanic as of yet

        // Play the pickup SFX
        waterPickup.play();
    }

    function collideGuitar(player, mariachi){
        if ((glasses > 0) && (mariachi.health <= 1)){
            hydrateMariachi(player, mariachi)
            guitar.mute = false;
        }

    }

    function collideViolin(player, mariachi){
        if ((glasses > 0) && (mariachi.health <= 1)){
            hydrateMariachi(player, mariachi)
            violin.mute = false;
        }

    }

    function collideTrumpet(player, mariachi){
        if ((glasses > 0) && (mariachi.health <= 1)){
            hydrateMariachi(player, mariachi)
            trumpet.mute = false;
        }

    }


    function hydrateMariachi(player, mariachi){
        // Increase health (used for completion tracking)
        mariachi.health += 1;

        // Animate the Mariachi member
        mariachi.play('play');

        // Use up a glass of water
        glasses -= 1;

        // Play the slurp SFX
        slurp.play();
    }

};
