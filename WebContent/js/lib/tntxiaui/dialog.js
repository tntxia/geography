;(function(){
	function setup($){
		$.dialog = function(opt,id){
			
			var body = $("body");
			
			if(opt=='close'){
				body.data("dialog"+id).remove();
				return;
			}
			
			opt.tools =[{
				iconCls:'panel-tool-close',
				handler:function(){
					panel.remove();
				}
			}];
			
			var contentDiv = $("<div>",{width:'100%',height:opt.height-50});
			
			
			contentDiv.css("overflow","scroll");
			contentDiv.appendTo(body);
			contentDiv.panel(opt);
			
			var panel = contentDiv.parent();
			if(opt.id){
				body.data("dialog"+opt.id,panel);
			}
			
			
			var windowWidth = $(window).width();
			panel.css("top","20%");
			panel.css("left",windowWidth/2-panel.width()/2);
			panel.css("position","absolute");
			panel.css("background","white");
			
			var operBar = panel.find(".panel-header");
			
			operBar.mousedown(function (e) { 
				
			    iDiffX = e.pageX - $(this).offset().left; 
			    iDiffY = e.pageY - $(this).offset().top; 
			    $(document).mousemove(function (e) { 
			    	panel.css({ "left": (e.pageX - iDiffX), "top": (e.pageY - iDiffY) }); 
			    });
			});
			   
			operBar.mouseup(function () { 
			    $(document).unbind("mousemove"); 
			});
			
			if(opt.url){
				contentDiv.loadPage(opt);
			}else{
				// 如果type属性有，按type属性来取值
				if(opt.type){
					if(opt.type=="grid"){
						var table = $tntxiaui.createTable(opt.gridOpt);
						opt.content = table;
					}
				}
				contentDiv.append(opt.content);
			}
			
			var buttonsDiv = $("<div>",{width:'100%'});
			buttonsDiv.css("text-align","center");
			if(opt.buttons){
				$.each(opt.buttons,function(i,b){
					var button = $("<button>",b);
					buttonsDiv.append(button);
				});
			}
			
			panel.append(buttonsDiv);
			
			return panel;
			
		};
	}
	
	// 使用之前把jquery导入
	define(["tntxiaui-panel"],function(){
		setup($);
	});
	
})();


