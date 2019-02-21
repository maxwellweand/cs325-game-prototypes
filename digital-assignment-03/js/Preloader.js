"use strict";

BasicGame.Preloader = function (game) {

	this.background = null;
	this.preloadBar = null;

	this.ready = false;

};

BasicGame.Preloader.prototype = {

	preload: function () {

		//	These are the assets we loaded in Boot.js
		//	A nice sparkly background and a loading progress bar
		this.background = this.add.sprite(0, 0, 'loadScreen');
		this.background.height = this.game.height;
		this.background.width = this.game.width;
		//	This sets the preloadBar sprite as a loader sprite.
		//	What that does is automatically crop the sprite from 0 to full-width
		//	as the files below are loaded in.
		//  this.load.setPreloadSprite(this.preloadBar);

		//	Here we load the rest of the assets our game needs.
		//	As this is just a Project Template I've not provided these assets, swap them for your own.
		this.load.image('titlePage', 'assets/title.jpg');
		this.load.atlas('playButton', 'assets/rosefish_button.png', 'assets/fish_button.json');
		this.load.audio('titleMusic', ['assets/icegitar.wav']);
		//	+ lots of other required assets here

		this.load.spritesheet('explosion', 'assets/exp2_0.png', 64, 64);
		this.load.spritesheet('seal_anim', 'assets/seal_anim.png', 64, 64);
		this.load.image('rosefish', 'assets/rosefish64.png');
		this.load.tilemap('map', 'assets/map.csv', null, Phaser.Tilemap.CSV);
		this.load.image('tiles', 'assets/tiles64.png');
		this.load.image('icebg', 'assets/icebg.jpg');

		this.load.spritesheet('iceblock', 'assets/iceblock64.png', 64, 64);

		this.load.image('seal', 'assets/seal.png');

		var map;
		var layer;
		var player;
		var input;


		var movementSpeed = 260;





	},

	create: function () {

		//	Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
		//this.preloadBar.cropEnabled = false;

	},

	update: function () {

		//	You don't actually need to do this, but I find it gives a much smoother game experience.
		//	Basically it will wait for our audio file to be decoded before proceeding to the MainMenu.
		//	You can jump right into the menu if you want and still play the music, but you'll have a few
		//	seconds of delay while the mp3 decodes - so if you need your music to be in-sync with your menu
		//	it's best to wait for it to decode here first, then carry on.
		
		//	If you don't have any music in your game then put the game.state.start line into the create function and delete
		//	the update function completely.
		
		if (this.cache.isSoundDecoded('titleMusic') && this.ready == false)
		{
			this.ready = true;
			this.state.start('MainMenu');
		}

	}

};
