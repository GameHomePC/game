Game = {};

var width = window.innerWidth,
    height = window.innerHeight;

Game.Boot = function(game){};

Game.Boot.prototype = {
    preload: function(){
        game.stage.backgroundColor = '#000';
        game.load.image('loading', 'public/game/img/loading/loading.png');
        game.load.image('loading1', 'public/game/img/loading/loading2.png');
    },
    create: function(){
        this.game.state.start('Load');
    }
};

Game.Load = function(game){};

Game.Load.prototype = {
    preload: function(){
        label2 = game.add.text(Math.floor(width/2)+0.5, Math.floor(height/2)-15+0.5, 'loading...', { font: '30px Arial', fill: '#fff' });
        label2.anchor.setTo(0.5, 0.5);

        preloading2 = game.add.sprite(width/2, height/2+15, 'loading1');
        preloading2.x -= preloading2.width/2;
        preloading = game.add.sprite(width/2, height/2+19, 'loading');
        preloading.x -= preloading.width/2;
        game.load.setPreloadSprite(preloading);

        game.load.spritesheet('player', 'public/game/img/player.png', 24, 30);
        game.load.image('logo', 'public/game/img/player.png');
        game.load.image('success', 'public/game/img/player.png');
        game.load.image('coin', 'public/game/img/player.png');
        game.load.image('enemy', 'public/game/img/player.png');
        game.load.spritesheet('sound', 'public/game/img/player.png', 28, 22);

        game.load.audio('coin', 'public/game/audio/coin.mp3');
        game.load.audio('dead', 'public/game/audio/coin.wav');

        this.game.load.tilemap('map1', 'public/game/json/level-1.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'public/game/img/terrain.png');
    },
    create: function(){
        game.state.start('Menu');
    }
};

Game.Menu = function(game){};
