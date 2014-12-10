var Map = function(game, plugin){
    this.game = game;
    this.plugin = plugin || false;
    this.maps = [];

    this.load = function(maps){
        var _this = this;
        var cacheKey, mapsLen = maps.length;
        var x, y;

        if (maps && maps.length){
            _this.maps = maps;

            mapsLen = _this.maps.length;

            if (_this.plugin){
                _this.game.add.plugin(Phaser.Plugin.Tiled);

                cacheKey = Phaser.Plugin.Tiled.utils.cacheKey;

                for (x = 0; x < mapsLen; x+=1){
                    (function(data){
                        var map = data.map;
                        var tiles = data.tiles;
                        var tilesLen;

                        _this.game.load.tiledmap(cacheKey(map.key, 'tiledmap'), map.url, null, map.type || Phaser.Tilemap.TILED_JSON);
                        if (tiles && tiles.length){
                            tilesLen = tiles.length;
                            for (y = 0; y < tilesLen; y+=1){
                                (function(key, dataTile){

                                    _this.game.load.image(cacheKey(key, 'tileset', dataTile.name), dataTile.url);

                                })(map.key, tiles[y]);
                            }
                        }

                    })(_this.maps[x]);
                }

            } else {

                for (x = 0; x < mapsLen; x+=1){
                    (function(data){
                        var map = data.map;
                        var tiles = data.tiles;
                        var tilesLen;

                        _this.game.load.tilemap(map.key, map.url, null, map.type || Phaser.Tilemap.TILED_JSON);

                        if (tiles && tiles.length){
                            tilesLen = tiles.length;
                            for (y = 0; y < tilesLen; y+=1){
                                (function(dataTile){

                                    _this.game.load.image(dataTile.name, dataTile.url);

                                })(tiles[y]);
                            }
                        }

                    })(_this.maps[x]);
                }

            }
        } else {
            _this.maps = [];
        }

        return this;
    };

    this.createMaps = function(index, layer, collisions){
        var _this = this;
        var mapsCreate = _this.mapsCreate = [];
        var x, y, mapsLen;

        layer = layer || 0;
        collisions = collisions || {};

        if (_this.maps && _this.maps.length){
            mapsLen = _this.maps.length;
            if (index == typeof 'number'){
                var mapIndex = _this.maps[index] || _this.maps[0];
                if (mapIndex){
                    var map = mapIndex.map;
                    var tiles = mapIndex.tiles;
                    var tilesLen, mapAdd;

                    if (!_this.plugin){

                        mapAdd = _this.game.add.tilemap(map.key);

                        if (tiles && tiles.length){
                            tilesLen = tiles.length;
                            for (y = 0; y < tilesLen; y+=1){
                                (function(mapAdd, dataTile){

                                    mapAdd.addTilesetImage(dataTile.name);

                                })(mapAdd, tiles[y]);
                            }
                        }

                        mapsCreate.push({
                            key: map.key,
                            map: mapAdd
                        });

                    } else {

                        mapAdd = _this.game.add.tiledmap(map.key);
                        mapsCreate.push({
                            key: map.key,
                            map: mapAdd
                        });

                    }

                }
            } else {
                for (x = 0; x < mapsLen; x+=1){
                    (function(data){
                        var map = data.map;
                        var tiles = data.tiles;
                        var tilesLen, mapAdd;
                        var layerx;

                        if (!_this.plugin){

                            mapAdd = _this.game.add.tilemap(map.key);

                            for (var c in collisions){
                                if (collisions.hasOwnProperty(c)){
                                    mapAdd[c](collisions[c]);
                                }
                            }

                            if (tiles && tiles.length){
                                tilesLen = tiles.length;
                                for (y = 0; y < tilesLen; y+=1){
                                    (function(mapAdd, dataTile){

                                        mapAdd.addTilesetImage(dataTile.name);

                                    })(mapAdd, tiles[y]);
                                }
                            }

                            layerx = mapAdd.createLayer(layer);
                            layerx.resizeWorld();


                            mapsCreate.push({
                                key: map.key,
                                map: mapAdd,
                                layer: layerx
                            });

                        } else {

                            mapAdd = _this.game.add.tiledmap(map.key);
                            mapsCreate.push({
                                key: map.key,
                                map: mapAdd
                            });

                        }


                    })(_this.maps[x]);
                }
            }

        }

        return this;
    };

    this.getMap = function(index){
        index = index || 0;
        return this.mapsCreate[index];
    };

};



var init = function(){
    var game, physics, renderer, parent, cursors;
    var w, h, cacheKey, map, layer;
    var player, playerMaterial, worldMaterial, contactMaterial;
    var mapsLoader, maps, linux;

    physics = Phaser.Physics.P2JS;
    renderer = Phaser.Auto;
    parent = document.getElementById('game');
    w = 1000;
    h = 700;

    game = new Phaser.Game(w, h, renderer, parent, {
        preload: function(){

            mapsLoader = new Map(game, true);
            mapsLoader.load([{
                map: {
                    key: 'map-1',
                    url: 'public/game/json/level-1.json'
                },
                tiles: [{
                    name: 'terrain',
                    url: 'public/game/img/terrain.png'
                }]
            }]);

            game.add.plugin(Phaser.Plugin.Debug);

            game.load.image('player', 'public/game/img/player.png');
            game.load.image('linux', 'public/game/img/linux.png');
            game.load.physics('dataP', 'public/game/json/polygon.json');

        },
        create: function(){

            game.physics.startSystem(physics);
            game.physics.p2.gravity.y = 500;

            map = mapsLoader.createMaps(0, 'layer', {
                setCollisionByExclusion: []
            }).getMap();



            linux = game.add.sprite(300, 300, 'linux');
            game.physics.p2.enable(linux, true);

            linux.body.clearShapes();
            linux.body.loadPolygon('dataP', 'linux');

            player = game.add.sprite(100, 100, 'player');
            game.physics.p2.enable(player, true);

            game.physics.p2.convertTiledCollisionObjects(map.map, 'collision');
            game.physics.p2.setBoundsToWorld(true, true, true, true, false);
            game.camera.follow(player);

        },
        update: function(){



        }
    });
};

$(init);