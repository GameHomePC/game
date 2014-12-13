Game.Menu = function(game){};

Game.Menu.prototype = {
    create: function(){
        this.cursor = game.input.keyboard;
        this.activeKey = Phaser.Keyboard;

        var logo = game.add.sprite(width/2, -150, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        game.add.tween(logo).to({ y: 150 }, 1000, Phaser.Easing.Bounce.Out).start();

        var label = game.add.text(width/2, height-50, 'press the ENTER arrow key to start', { font: '25px Arial', fill: '#fff' });
        label.anchor.setTo(0.5, 0.5);

    },
    update: function(){
        if(this.cursor.isDown(this.activeKey.ENTER)){
            game.state.start('Play');
        }
    }
};