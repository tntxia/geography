
// tntxiaui panel组件

define(['jquery'],function($){
	$.fn.panel = function(opt){
		
		function wrapPanel(target){
			var panel = $("<div>",{'class':'panel',width:opt.width,height:opt.height});
			target.wrap(panel);
			return panel;
		}
		
		function addHeader(target,opt){
			
			var title = "";
			if(opt){
				title = opt.title;
			}
			
			var header = $("<div>",{
				'class':'panel-header',
				height:16
			});
			
			var titleDiv = $("<div>",{text:title});
			titleDiv.css("float","left");
			titleDiv.appendTo(header);
			
			var tool = $("<div class=\"panel-tool\"></div>").appendTo(header);
			tool.bind("click", function (e) {
	            e.stopPropagation();
	        });
			
			if(opt.tools && opt.tools.length){
				$.each(opt.tools,function(i,d){
					var t = $("<a href=\"javascript:void(0)\"></a>").addClass(d.iconCls).appendTo(tool);
					if (d.handler) {
	                    t.bind("click", d.handler);
	                }
				});
			}
			
			target.before(header);
		}
		
		var panel = wrapPanel(this);
		addHeader(this,opt);
		return panel;
		
	};
	
});

