Game.Play = function(game){};

Game.Play.prototype = {
    create: function(){
        var play = game.add.text(width/2, height-50, 'Go Go Go games', { font: '25px Arial', fill: '#fff' });
        play.anchor.setTo(0.5, 0.5);
    }
};