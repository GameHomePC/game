Game.Play = function(game){};

Game.Play.prototype = {
    create: function(){
        this.cursor = game.input.keyboard;
        this.activeKey = Phaser.Keyboard;

        var play = game.add.text(width/2, height-50, 'Go Go Go games', { font: '25px Arial', fill: '#fff' });
        play.anchor.setTo(0.5, 0.5);
    },
    update: function(){
        if(this.cursor.isDown(this.activeKey.ENTER)){
            game.state.start('Menu');
        }
    }
};