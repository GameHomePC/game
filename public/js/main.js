var game, player, getPlayer, cursors;
var circle, blocks, emitter;
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

console.log(deadZoneCamera);

game = new Phaser.Game(widthCanvas, heightCanvas, Phaser.AUTO, 'game', {
    preload: function(){

        game.load.spritesheet('player', 'public/images/phaser/player.png', 200, 200, 4);
        game.load.image('dirt', 'public/images/phaser/dirt.png');
        game.load.image('cloud', 'public/images/phaser/cloud.png');
        game.load.image('glass', 'public/images/phaser/glass.png');

    },
    create: function(){

        var options = {
            w: 50,
            h: 50,
            xCount: 100,
            yCount: 100,
            random: function(min, max){
                return Math.round(Math.random() * (max - min)) + min;
            },
            bounds: function(){
                this.boundsX = this.xCount * this.w;
                this.boundsY = this.yCount * this.h;

                return { x: this.boundsX, y: this.boundsY };
            },
            metre: function(value, percent){
                return (value / 100) * percent;
            }
        };

        var bounds = options.bounds();
        var metre = options.metre(options.yCount, 50);

        game.world.setBounds(0, 0, bounds.x, bounds.y);


        var block;

        blocks = {
            cloud: game.add.group(),
            dirt: game.add.group(),
            glass: game.add.group()
        };

        for (var x = 0; x < options.xCount; x+=1){

            for (var y = 0; y < options.yCount; y+=1){

                if (metre == y) {
                    block = blocks.glass.create(x * options.w, y * options.h, 'glass');
                } else if (metre > y) {
                    block = blocks.cloud.create(x * options.w, y * options.h, 'cloud');
                } else if (metre < y) {
                    block = blocks.dirt.create(x * options.w, y * options.h, 'dirt');
                }

            }

            metre += options.random(-1, 1);


        }
        
        game.physics.startSystem(Phaser.Physics.ARCADE);

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