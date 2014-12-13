var game = new Phaser.Game(width, height, Phaser.WEBGL, 'canvas');

game.state.add('Boot', Game.Boot);
game.state.add('Load', Game.Load);
game.state.add('Menu', Game.Menu);

game.state.start('Boot');