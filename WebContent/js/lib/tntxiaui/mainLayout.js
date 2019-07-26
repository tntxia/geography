define(['tntxiaui-loadPage'],function(){
	
	$.fn.loadPage = function(opt){
		var content = this;
		
		var ajaxOption = $.extend(opt,{
			cache:false,
			success:function(pageResult){
				
				var html;
				if(opt.templateData){
					var compile = _.template(pageResult);
					html = compile(opt.templateData);
				}else{
					html = pageResult;
				}
				content.html(html);
				if(opt.onFinish){
					opt.onFinish();
				}
			}
		});
		$.ajax(ajaxOption);
	};
	
	function loadLeftAndMain(headDiv,opt,width,height,container){
		var headerHeight = headDiv.height();
		var leftWidth = opt.left.width;
		var heightRemain = height-headerHeight;
		
		var leftDiv = $("<div>",{
			'class':'tntxia-ui-mainlayout-leftbar',
			height:heightRemain,
			width : leftWidth
		});
		
		// 左边菜单的处理
		if(opt.left.content){
			var content = opt.left.content;
			leftDiv.append(content);
		}else if(opt.left.menus){
			var menus = opt.left.menus;
			if(menus && menus.length){
				$.each(menus,function(i,m){
					var menu = $("<div>",{title:m.title});
					leftDiv.append(menu);
					var ol = $("<ol>");
					menu.append(ol);
					$.each(m.items,function(i,item){
						var li = $("<li>");
						var a = $("<a>",item);
						li.append(a);
						ol.append(li);
					});
				});
			}
			
			require(["tntxiaui-accordion"],function(){
				leftDiv.accordion();
			});
			
		}
		
		leftDiv.css("float","left");
		leftDiv.css("overflow","auto");
		container.append(leftDiv);
		
		var contentDiv = $("<div>",{
			'class':'tntxia-ui-mainlayout-content'
		});
		contentDiv.css({
			"float":"left",
			width:width-leftWidth-19,
			height:heightRemain
		});
		
		container.append(contentDiv);
	}
	
	function setup(container,width,height,opt){
		var headerOpt = opt.header;
		var headDiv = $("<div>",{'class':'tntxia-ui-mainlayout-header'});
		container.append(headDiv);
		
		if(headerOpt.ico){
			var img = $("<img>",{src:headerOpt.ico});
			headDiv.append(img);
		}
		
		if(headerOpt.content){
			var content = headerOpt.content;
			if(content){
				headDiv.append(content);
			}
			loadLeftAndMain(headDiv,opt,width,height,container);
		}
		
		if(headerOpt.url){
			headDiv.loadPage({
				url:headerOpt.url,
				onFinish : function(){
					loadLeftAndMain(headDiv,opt,width,height,container);
				}
			});
		}
		
		
	}
	
	$.mainLayout = function(opt){
		var w = $(window);
		var width = w.width();
		var height = w.height();
		var container = $("body");
		setup(container,width,height,opt);
	};
	
	$.fn.mainLayout = function(opt){
		var container = this;
		var width = container.width();
		var height = container.height();
		setup(container,width,height,opt);
	};
	
	return $;
});