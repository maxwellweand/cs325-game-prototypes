"use strict";

GameStates.makeMainMenu = function( game, shared ) {

    var lead = null;
	var melody = null;
	var beats = null;
	var killedMelody = null;
	var BGM;
	var playButton = null;
    
    function startGame(pointer) {


        lead.mute = true;
        killedMelody.mute = false;
        beats.mute = false;



        //	And start the actual game
        game.state.start('Stage1');

    }
    
    return {
    
        create: function () {
    
            //	We've already preloaded our assets, so let's kick right into the Main Menu itself.
            //	Here all we're doing is playing some music and adding a picture and button
            //	Naturally I expect you to do something significantly better :)
    
            lead = game.add.audio('lead');
            melody = game.add.audio('melody');
            beats = game.add.audio('beats');
            killedMelody = game.add.audio('killedMelody');

            lead.stop();
            melody.stop();
            beats.stop();
            killedMelody.stop();

            lead.play();

            BGM = [ lead, melody, beats, killedMelody];
            game.sound.setDecodedCallback(BGM, startMusic, this);

            lead.mute = false;
            melody.mute = true;
            beats.mute = true;
            killedMelody.mute = true;


            game.add.sprite(0, 0, 'titlePage');
    
            playButton = game.add.button( 303, 400, 'playButton', startGame, null, 'over', 'out', 'down');
    
        },
    
        update: function () {
    
            //	Do some nice funky main menu effect here
    
        }

        
    };

    function startMusic(){
        lead.loopFull(1);
        melody.loopFull(1);
        beats.loopFull(.7);
        killedMelody.loopFull(1);
    }
};
