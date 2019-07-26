var EasyMap = function(opt){
	
	var url = opt.url;
	
	var zoom = opt.zoom;
	var center = opt.center;
	
	var container = opt.container;
	
	var width = container.width();
	var height = container.height();
	if(!height){
		height = 500;
	}
	
	var canvas = $("<canvas>");
	canvas.attr("width",width);
	canvas.attr("height",height);
	canvas.appendTo(container);
	
	var r = 256*Math.pow(2,zoom);
	
	function decode(json) {
        if (!json.UTF8Encoding) {
            return json;
        }
        var features = json.features;

        for (var f = 0; f < features.length; f++) {
            var feature = features[f];
            var geometry = feature.geometry;
            var coordinates = geometry.coordinates;
            var encodeOffsets = geometry.encodeOffsets;

            for (var c = 0; c < coordinates.length; c++) {
                var coordinate = coordinates[c];

                if (geometry.type === 'Polygon') {
                    coordinates[c] = decodePolygon(
                        coordinate,
                        encodeOffsets[c]
                    );
                }
                else if (geometry.type === 'MultiPolygon') {
                    for (var c2 = 0; c2 < coordinate.length; c2++) {
                        var polygon = coordinate[c2];
                        coordinate[c2] = decodePolygon(
                            polygon,
                            encodeOffsets[c][c2]
                        );
                    }
                }
            }
        }
        // Has been decoded
        json.UTF8Encoding = false;
        return json;
    }

    function decodePolygon(coordinate, encodeOffsets) {
        var result = [];
        var prevX = encodeOffsets[0];
        var prevY = encodeOffsets[1];

        for (var i = 0; i < coordinate.length; i += 2) {
            var x = coordinate.charCodeAt(i) - 64;
            var y = coordinate.charCodeAt(i + 1) - 64;
            // ZigZag decoding
            x = (x >> 1) ^ (-(x & 1));
            y = (y >> 1) ^ (-(y & 1));
            // Delta deocding
            x += prevX;
            y += prevY;

            prevX = x;
            prevY = y;
            // Dequantize
            result.push([x / 1024, y / 1024]);
        }

        return result;
    }

    /**
     * @inner
     */
    function flattern2D(array) {
        var ret = [];
        for (var i = 0; i < array.length; i++) {
            for (var k = 0; k < array[i].length; k++) {
                ret.push(array[i][k]);
            }
        }
        return ret;
    }
    
    /*经纬度转墨卡托投影坐标*/
    function lonlatToMercator(lon,lat) {
        var mercator={x:0,y:0};
        var x = lon *r/2/180;
        var y = Math.log(Math.tan((90+lat)*Math.PI/360))/(Math.PI/180);
        y = y * r/2/180;
        mercator.x = x;
        mercator.y = y;
        return mercator ;
    }
    
    function drawCoord(coord,context){
    	
    	
    	if(!coord.length){
    		return;
    	}
    	var path = coord[0];
    	
    	
		context.beginPath();
		var p = path[0]
		var mercator = lonlatToMercator(p[0],p[1]);
		context.moveTo(r/2+mercator.x,r/2-mercator.y);
		context.lineTo(r/2+mercator.x,r/2-mercator.y);
		
		for(var i=1;i<path.length;i++){
			var p = path[i];
			var mercator = lonlatToMercator(p[0],p[1]);
			
			context.lineTo(r/2+mercator.x,r/2-mercator.y);
		}
		context.stroke();
    }
    
    function drawFeature(feature,context){
    	
    	var geometry = feature.geometry;
    	
    	if(geometry.type=="MultiPolygon"){
    		for(var i=0;i<geometry.coordinates.length;i++){
    			var subCoord = geometry.coordinates[i];
    			drawCoord(subCoord,context);
    		}
    	}else{
    		drawCoord(geometry.coordinates,context);
    	}
    	
    }
    
	
	$.getJSON(url,function(res){
		
		var mapj = decode(res);
		
		
		
		var context = canvas.get(0).getContext("2d");
		
		if(center){
			var centerMercator = lonlatToMercator(center.lon,center.lat);
			
			console.log(centerMercator);
			console.log(width/2 - centerMercator.x,height/2 - centerMercator.y);
			
			var centerX = centerMercator.x+r/2;
			var centerY = r/2 - centerMercator.y;
			
			context.translate(width/2 - centerX,height/2 - centerY);
			
		}
		
		for(var i=0;i<mapj.features.length;i++){
			var feature = mapj.features[i];
			drawFeature(feature,context);
			
		}
		
	});
	
}

