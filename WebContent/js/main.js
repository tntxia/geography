

var app = angular.module('geoApp',[]);

app.run(function(){
	
});

app.controller('geoController',function($http,$scope){
	
	var currentId;
	var container = $("#map");
	var width = container.width();
	var height = container.height();
	
	var stage = new Stage({
		container:container
	});
	
	stage.paint();
	
	list();
	
	$scope.viewGIS = function(id){
		
		$("#currentId").val(id);
		
		$("#uploadModal").modal('show');
		
		stage.clear();
		stage.paint();
		
		$http.get("country!getPolygon.do?id="+id).then(function(res){
			
			var polygon = res.data.polygon;
			
			if(!polygon){
				return;
			}
			
			var pArr = polygon.split("|");
			
			if(pArr){
				
				var startPoint;
				$.each(pArr,function(i,d){
					
					var ppArr = d.split(";");
					
					var path = [];
					
					$.each(ppArr,function(i,d){
						var ll = d.split(",");
						var lon = parseFloat(ll[0]);
						var lat = parseFloat(ll[1]);
						var mercator = lonlatToMercator(lon,lat,width,height);
						
						path.push(mercator);
					})
					stage.add({
						type:'polygon',
						path:path
					});
				});
				
				stage.paint();
			}
			
		})
		
		
	}
	
	$scope.setPolygon = function(){
		
		$("#uploadForm").ajaxSubmit({
			success:function(data){
				console.log(data);
			}
		});
		
	}
	
	$scope.search = function(){
		list();
	}
	
	var currentTreeNode;
	
	function showRMenu(treeNode,x,y){
		currentTreeNode = treeNode;
		
		$("#rMenu ul").show();
		var rMenu = $("#rMenu");
		rMenu.show();
		rMenu.css({"top":y+14+"px", "left":x+"px", "visibility":"visible"});
	}
	
	$scope.addChildren = function(id){
		
		$("#addChildrenModal").modal('show');
		
		
		
		var setting = {
			view: {
				dblClickExpand: false
			},
			check: {
				enable: true
			},
			callback: {
				onRightClick: function(event, treeId, treeNode){
					
					showRMenu(treeNode,event.clientX, event.clientY);
				}
			}
		};
		
		$http.get('country!getRegionZTreeList.do?id='+id).then(function(res){
			$.fn.zTree.init($("#treeDiv"), setting, res.data);
		});
	}
	
	$scope.addSubRegion = function(){
		
		$("#rMenu").hide();
		if(!$scope.addModel){
			$scope.addModel = {};
		}
		if(!currentTreeNode){
			return;
		}
		$scope.addModel.parentRegionId = currentTreeNode.id;
		$scope.addModel.parentRegionName = currentTreeNode.name;
		$("#addChildrenModal").modal('hide');
		$("#addModal").modal('show');
		
	}
	
	/*经纬度转墨卡托投影坐标*/
    function lonlatToMercator(lon,lat,width,height) {
    	
    	var r;
    	if(width<height){
    		r = width;
    	}else{
    		r = height;
    	}
    	
        var mercator={x:0,y:0};
        var x = lon *r/2/180;
        var y = Math.log(Math.tan((90+lat)*Math.PI/360))/(Math.PI/180);
        y = y * r/2/180;
        mercator.x = r/2 + x;
        mercator.y = r/2 - y;
        return mercator ;
    }
    
    function list(){
		$http.post("country!list.do",{
			searchVal:$scope.searchVal
		}).then(function(res){
			$scope.rows = res.data.rows;
		});
	}
	
})
