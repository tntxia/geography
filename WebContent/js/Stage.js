function Stage(opt){
	
	var container = opt.container;
	
	var width = container.width();
	var height = container.height();
	
	var canvas = $("<canvas>");
	canvas.attr("width",width);
	canvas.attr("height",height);
	container.append(canvas);
	
	var _context = canvas.get(0).getContext("2d");
	
	var _views = [];
	
	this.addView = function(){
		var view = new View();
		_views.push(view);
		return view;
	}
	
	this.add = function(opt){
		var view;
		if(_views.length==0){
			view = this.addView(view);
		}else{
			view = _views[0];
		}
		view.add(opt);
	}
	
	this.paint = function(opt){
		
		_context.clearRect(0,0,width,height);
		
		_context.save();
		
		for(var i=0;i<_views.length;i++){
			var view = _views[i];
			view.paint();
		}
		
		_context.restore();
	}
	
	this.clear = function(){
		_views = [];
	}
	
	
	function View(){
		
		this.elements = [];
		
		this.add = function(opt){
			
			var _elements = this.elements;
			
			var display = displayElementFactory.createDisplayElement(opt);
			_elements.push(display);
			
			
			
		}
		
		this.paint = function(){
			
			var _elements = this.elements;
			
			for(var i=0;i<_elements.length;i++){
				var ele = _elements[i];
				ele.paint();
			}
		}
	}
	
	var displayElementFactory={
		
		createDisplayElement : function(opt){
			if(opt.type=="polygon"){
				return new Polygon(opt);
			}else if(opt.type=="group"){
				return new Group(opt);
			}
		}
	
	}
	
	function Group(opt){
		
		var _elements = [];
		
		this.add = function(opt){
			_elements.push(displayElementFactory.createDisplayElement(opt));
		}
		
		this.paint = function(){
			for(var i=0;i<_elements.length;i++){
				var ele = _elements[i];
				ele.paint();
			}
		}
		
	}
	
	// 多边形
	function Polygon(opt){
		
		this.path = opt.path;
		
		this.style = opt.style;
		
		this.highLightStyle = opt.highLightStyle;
		
		this.paint = function(){
			
			var path = this.path;
			var startPoint = this.path[0];
			
			_context.save();
			
			var style = this.style;
			
			if(style && style.fillStyle){
				_context.fillStyle = style.fillStyle;
			}
			
			_context.beginPath();
			
			_context.moveTo(startPoint.x,startPoint.y);
			
			for(var i=1;i<path.length;i++){
				var p = path[i];
				_context.lineTo(p.x,p.y);
			}
			
			_context.closePath();
			
			_context.fill();
			_context.stroke();
			
			_context.restore();
			
		}
		
		
	}
	
	
}