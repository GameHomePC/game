Game.Menu = function(game){};

Game.Menu.prototype = {
    create: function(){
        this.cursor = game.input.keyboard;
        this.activeKey = Phaser.Keyboard;

        console.log('1212');
    },
    update: function(){
        if(this.cursor.isDown(this.activeKey.SPACEBAR)){

        }
    }
};