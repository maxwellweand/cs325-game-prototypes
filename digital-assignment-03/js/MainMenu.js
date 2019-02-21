"use strict";

BasicGame.MainMenu = function (game) {

	this.music = null;
	this.playButton = null;

};

BasicGame.MainMenu.prototype = {

	create: function () {

		//	We've already preloaded our assets, so let's kick right into the Main Menu itself.
		//	Here all we're doing is playing some music and adding a picture and button
		//	Naturally I expect you to do something significantly better :)

		this.music = this.add.audio('titleMusic');
		this.music.loop = true;

		var titleSprite = this.add.sprite(0, 0, 'titlePage');
		titleSprite.height = this.game.height;
		titleSprite.width = this.game.width;




		var style = { font: "25px Verdana", fill: "#9999ff", align: "center" };
		var text = this.game.add.text( this.game.world.centerX, 15, "Bring the rosefish to ur girlfriend seal.", style );
		text.anchor.setTo( 0.5, 0.0 );

		this.playButton = this.add.button( 303, 400, 'playButton', this.startGame, this, 'over', 'out', 'down');
	},

	update: function () {

		//	Do some nice funky main menu effect here

	},

	startGame: function (pointer) {

		this.music.play();

		//	And start the actual game
		this.state.start('Game');

	}

};
