window.onload = function() {
    // You might want to start with a template that uses GameStates:
    //     https://github.com/photonstorm/phaser/tree/v2.6.2/resources/Project%20Templates/Basic
    
    // You can copy-and-paste the code from any of the examples at http://examples.phaser.io here.
    // You will need to change the fourth parameter to "new Phaser.Game()" from
    // 'phaser-example' to 'game', which is the id of the HTML element where we
    // want the game to go.
    // The assets (and code) can be found at: https://github.com/photonstorm/phaser/tree/master/examples/assets
    // You will need to change the paths you pass to "game.load.image()" or any other
    // loading functions to reflect where you are putting the assets.
    // All loading functions will typically all be found inside "preload()".
    
    "use strict";
    
    var game = new Phaser.Game( 800, 600, Phaser.AUTO, 'game', { preload: preload, create: create, update: update, render: render } );
    
    function preload() {
        // Map stuff
        // load a tile map and call it 'map'.
        game.load.tilemap('map', 'assets/tilemap.json', null, Phaser.Tilemap.TILED_JSON);
        // load tiles for map
        game.load.image('tiles', 'assets/tileset.png');


        // Player
        game.load.spritesheet('marshmallow_anim', 'assets/marshmallow_anim_2.png', 160, 130);


        // Glasses of Water
        game.load.image('water1', 'assets/water1.png');
        game.load.image('water2', 'assets/water2.png');
        game.load.image('water3', 'assets/water3.png');
        game.load.audio('waterPickup', 'assets/water_splash.wav');



        // Mariachi Band
        game.load.spritesheet('mariachi1_anim', 'assets/guitar.png', 500, 500);
        //game.load.spritesheet('mariachi2_anim', 'trumpet.png');
        //game.load.spritesheet('mariachi3_anim', 'trumpet.png');
        //game.load.audio('guitar', 'assets/gourmet.mp3');
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
        mariachi1 = game.add.sprite( game.world.centerX+140, game.world.centerY-400, 'mariachi1_anim');
        //mariachi2 = game.add.sprite( game.world.centerX+140, game.world.centerY-450, 'mariachi2_anim');
        //mariachi3 = game.add.sprite( game.world.centerX+60, game.world.centerY-450, 'mariachi3_anim');


        mariachi1.scale.setTo(.2,.2);
        //
        //
        guitar = game.add.audio('guitar');
        //trumpet = game.add.audio('trumpet');
        //violin = game.add.audio('violin');

        game.physics.enable(mariachi1, Phaser.Physics.ARCADE);
        //game.physics.enable(mariachi2, Phaser.Physics.ARCADE);
        //game.physics.enable(mariachi3, Phaser.Physics.ARCADE);

        mariachi1.body.setSize(250,300,100,200);



        mariachi1.body.immovable = true;
        //mariachi2.body.immovable = true;
        //mariachi3.body.immovable = true;


        slurp = game.add.audio('slurp');


        // Mariachi animations
        mariachi1.animations.add('play', [1,2], 10, true);
        //mariachi2.animations.add('play', [1,2], 10, true);
        //mariachi3.animations.add('play', [1,2], 10, true);




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








    }

    function render(){

        //game.debug.body(marshmallow);
        //game.debug.body(mariachi1);


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
        if (glasses > 0){
            hydrateMariachi(player, mariachi)
            guitar.play();
        }

    }

    function hydrateMariachi(player, mariachi){
        // Animate the Mariachi member
        mariachi.play('play');

        // Use up a glass of water
        glasses -= 1;

        // Play the slurp SFX
        slurp.play();
    }

};
