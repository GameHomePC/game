var collisionPacker = function(game){
    this.game = game;

    this.getObjectLayer = function(map, layer){
        var objects = map.objects;
        return objects[layer];
    };

    this.layerMap = function(map, layer){
        var layersMap = map.layers;
        var currentLayer;

        if (layersMap && layersMap.length) {

            for (var x = 0, len = layersMap.length; x < len; x += 1) {
                var data = layersMap[x];
                if (data.name == layer) {
                    currentLayer = data;
                    break;
                }
            }

        }

        return currentLayer;
    };

    this.eachDataLayer = function(layer, callback){
        if (layer){
            var bodies = layer.bodies = [];

            for (var yC = 0, yLen = layer.height; yC < yLen; yC+=1){
                for (var xC = 0, xLen = layer.width; xC < xLen; xC+=1){
                    callback.call(this, layer.data[yC][xC], layer);
                }
            }
        }
    };

    this.setTileCollision = function(map, layer, options, addToWorld){
        options = options || {
            key: 'collide',
            value: 'yes'
        };

        addToWorld = addToWorld || true;

        var layerMap = this.layerMap(map, layer);
        var bodies = layerMap.bodies = [];

        this.eachDataLayer(layerMap, function(tile){
            var properties = tile.properties;
            if (tile && properties && properties[options.key] == options.value){
                var body = this.game.physics.p2.createBody(tile.worldX, tile.worldY, 0, false);
                body.addRectangle(tile.width, tile.height, tile.width / 2, tile.height / 2);
                bodies.push(body);

                if (addToWorld){
                    this.game.physics.p2.addBody(body);
                }
            }
        });

        return bodies;
    };

    this.setTileIndexCollision = function(map, layer, indexses, addToWorld){
        indexses = indexses || [];
        addToWorld = addToWorld || true;

        var layerMap = this.layerMap(map, layer);
        var bodies = layerMap.bodies = [];

        this.eachDataLayer(layerMap, function(tile){
            if (tile && indexses.length && indexses.indexOf(tile.index) !== -1){
                var body = this.game.physics.p2.createBody(tile.worldX, tile.worldY, 0, false);
                body.addRectangle(tile.width, tile.height, tile.width / 2, tile.height / 2);
                bodies.push(body);

                if (addToWorld){
                    this.game.physics.p2.addBody(body);
                }
            }
        });

        return bodies;
    };

    this.setObjectCollision = function(map, layer, addToWorld){
        var bodies = [];
        var material = {};

        if (typeof addToWorld === 'undefined') { addToWorld = true; }

        var collisionObject = this.getObjectLayer(map, layer);

        var mapPointToArray = function(object){
            return [object[0], object[1]];
        };

        for (var i = 0, len = collisionObject.length; i < len; i+=1){

            var object = collisionObject[i];
            var prop = object.properties;

            var body = this.game.physics.p2.createBody(object.x, object.y, 0, false);

            if (object.polygon || object.polyline) {
                var mapArray = (object.polygon || object.polyline).map(mapPointToArray);

                if (!body.addPolygon(null, mapArray)) {
                    console.warn('Unable to add poly collision body for object:', object);
                    continue;
                }
            }

            else if (object.ellipse) {
                body.addCircle(object.width, object.width / 2, object.width / 2, object.rotation);
            }
            // no polygon, use rectangle defined by object itself
            else {
                body.addRectangle(object.width, object.height, object.width / 2, object.height / 2, object.rotation);
            }

            if (addToWorld){
                this.game.physics.p2.addBody(body);
            }

            bodies.push(body);

            if (prop && prop.type){
                if (material[prop.type]){
                    material[prop.type].push(body);
                } else {
                    material[prop.type] = [];
                    material[prop.type].push(body);
                }
            }


        }

        var createMaterial = function(game, material){
            var materialBody = {};

            for (var prop in material){
                if (material.hasOwnProperty(prop)){
                    if (!materialBody[prop]){
                        materialBody[prop] = game.physics.p2.createMaterial(prop);
                    }
                }
            }

            for (var prop2 in material){
                if (material.hasOwnProperty(prop2)){
                    var data = material[prop2];
                    var mat = materialBody[prop2];
                    if (data && data.length && mat){
                        game.physics.p2.setMaterial(mat, data);
                    }
                }
            }

            return materialBody;
        };

        return {
            body: bodies,
            material: createMaterial(game, material),
            debug: function(debug){
                debug = debug || false;

                for (var x = 0; x < this.body.length; x+=1){
                    this.body[x].debug = debug;
                }
            }
        };

    };
};