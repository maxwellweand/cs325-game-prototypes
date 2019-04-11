"use strict";

GameStates.makeMainMenu = function( game, shared ) {

	var melody = null;
	var beats = null;
	var BGM;
	var playButton = null;
    
    function startGame(pointer) {

        // TODO: Unmute the second track and don't stop the first track.
        beats.mute = false;



        //	And start the actual game
        game.state.start('Stage1');

    }
    
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            melody = game.add.audio('melody');
            beats = game.add.audio('beats');
            melody.stop();
            beats.stop();
            melody.play();
            BGM = [ melody, beats];
            game.sound.setDecodedCallback(BGM, startMusic, this);
            melody.mute = false;
            beats.mute = true;


            game.add.sprite(0, 0, 'titlePage');
    
            playButton = game.add.button( 303, 400, 'playButton', startGame, null, 'over', 'out', 'down');
    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }

        
    };

    function startMusic(){
        melody.loopFull(1);
        beats.loopFull(1);
    }
};
