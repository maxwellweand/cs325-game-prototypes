"use strict";

GameStates.makePreloader = function( game ) {

	var background = null;
	var preloadBar = null;

	var ready = false;

    return {
    
        preload: function () {
    
            //	These are the assets we loaded in Boot.js
            //	A nice sparkly background and a loading progress bar
            background = game.add.sprite(0, 0, 'preloader');
            background.animations.add('loading', [0,1,2], 12, true);
            background.play('loading');

            //	This sets the preloadBar sprite as a loader sprite.
            //	What that does is automatically crop the sprite from 0 to full-width
            //	as the files below are loaded in.

    
            //	Here we load the rest of the assets our game needs.
            //	As this is just a Project Template I've not provided these assets, swap them for your own.
            game.load.image('titlePage', 'assets/title.jpg');
            game.load.atlas('playButton', 'assets/play_button.png', 'assets/play_button.json');
            //	+ lots of other required assets here


            // BGM
            game.load.audio('melody', 'assets/popper melody.ogg');
            game.load.audio('beats', 'assets/popper beats.ogg');

            // Map background
            game.load.image('background', 'assets/skybox.png');
            game.load.spritesheet('sun_anim', 'assets/sun_anim.png', 222, 198);
            game.load.image('ground', 'assets/plattile_basic.png');


            // Player
            game.load.spritesheet('bacon', 'assets/bacon_anim.png', 118, 176);

            // Bacon bits
            game.load.spritesheet('bacon bits', 'assets/baconbits_anim.png', 71, 81);
            game.load.audio('yay', 'assets/yay.ogg');

            // Enemies

            // Goal (frying pan)
            game.load.spritesheet('pan_anim', 'assets/pan_anim.png', 575, 225);
            game.load.audio('sizzle', 'assets/sizzle.ogg');





        },
    
        create: function () {

        },
    
        update: function () {
    
            //	You don't actually need to do this, but I find it gives a much smoother game experience.
            //	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
            //	You can jump right into the menu if you want and still play the music, but you'll have a few
            //	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
            //	it's best to wait for it to decode here first, then carry on.
            
            //	If you don't have any music in your game then put the game.state.start line into the create function and delete
            //	the update function completely.
            
            if (game.cache.isSoundDecoded('melody') && ready == false)
            {
                ready = true;
                game.state.start('MainMenu');
            }
    
        }
    
    };
};
