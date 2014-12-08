var game, player, getPlayer, cursors;
var circle, blocks, emitter, bg, map, layer;
var w = window;

var percent = function(value, percent){
    return (value / 100) * percent;
};

var widthCanvas = 600,
    heightCanvas = 480,
    deadZoneCamera = {
        x: percent(widthCanvas, 10),
        y: percent(heightCanvas, 10),
        w: widthCanvas - (percent(widthCanvas, 10) * 2),
        h: heightCanvas - (percent(heightCanvas, 10) * 2)
    };

game = new Phaser.Game(widthCanvas, heightCanvas, Phaser.AUTO, 'game', {
    preload: function(){

        game.load.spritesheet('player', 'public/phaser_source/img/droid.png', 32, 32, 4);
        game.load.image('dirt', 'public/phaser_source/img/dirt.png');
        game.load.image('cloud', 'public/phaser_source/img/cloud.png');
        game.load.image('glass', 'public/phaser_source/img/glass.png');
        game.load.image('background', 'public/phaser_source/img/background.png');
        game.load.image('tiles-1', 'public/phaser_source/img/tiles-1.png');
        game.load.tilemap('levels', 'public/phaser_source/json/levels.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.pack('audio', 'public/phaser_source/json/audio.json', null, this);

    },
    create: function(){

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#000000';

        /* audio */
        game.sound.play('boden');

        bg = game.add.tileSprite(0, 0, widthCanvas, heightCanvas, 'background');
        bg.fixedToCamera = true;

        map = game.add.tilemap('levels');
        map.addTilesetImage('tiles-1');
        map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);
        layer = map.createLayer('Tile Layer 1');

        //  Un-comment this on to see the collision tiles
        // layer.debug = true;

        layer.resizeWorld();

        game.physics.arcade.gravity.y = 1000;

        player = new Player(game, 'player', 1, [0], layer);
        getPlayer = player.getPlayer();

        console.log(getPlayer.body);

        game.camera.follow(getPlayer);
        // game.camera.deadzone = new Phaser.Rectangle(deadZoneCamera.x, deadZoneCamera.y, deadZoneCamera.w, deadZoneCamera.h);
    },
    update: function(){
        player.update();
    },
    render: function(){

        game.debug.cameraInfo(game.camera, 32, 32);
    }
});