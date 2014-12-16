(function(State){

    var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO);

    game.state.add('Boot', State.Boot);
    game.state.add('Load', State.Load);
    game.state.add('Menu', State.Menu);
    game.state.add('Play', State.Play);

    game.state.start('Boot');

})(state);