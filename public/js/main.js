var game, player, getPlayer, cursors;
var circle, blocks, emitter, bg;
var w = window;

var percent = function(value, percent){
    return (value / 100) * percent;
};

var widthCanvas = 800,
    heightCanvas = 600,
    deadZoneCamera = {
        x: percent(widthCanvas, 10),
        y: percent(heightCanvas, 10),
        w: widthCanvas - (percent(widthCanvas, 10) * 2),
        h: heightCanvas - (percent(heightCanvas, 10) * 2)
    };

game = new Phaser.Game(widthCanvas, heightCanvas, Phaser.AUTO, 'game', {
    preload: function(){

        game.load.spritesheet('player', 'public/images/phaser/player.png', 200, 200, 4);
        game.load.image('dirt', 'public/images/phaser/dirt.png');
        game.load.image('cloud', 'public/images/phaser/cloud.png');
        game.load.image('glass', 'public/images/phaser/glass.png');
        game.load.image('background', 'public/images/phaser/background.png');

    },
    create: function(){

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.stage.backgroundColor = '#000000';

        bg = game.add.tileSprite(0, 0, widthCanvas, heightCanvas, 'background');
        bg.fixedToCamera = true;


        player = new Player(game, 'player', 0.5, 0);
        getPlayer = player.getPlayer();

        game.camera.follow(getPlayer);
        // game.camera.deadzone = new Phaser.Rectangle(deadZoneCamera.x, deadZoneCamera.y, deadZoneCamera.w, deadZoneCamera.h);

        cursors = game.input.keyboard.createCursorKeys();

    },
    update: function(){

        player.update();

    },
    render: function(){

        game.debug.cameraInfo(game.camera, 32, 32);

    }
});