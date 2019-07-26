
// 使用之前把jquery导入
define(["tntxiaui-panel"],function(){
	$.fn.accordion = function(){
		var children = this.children();
		var size = children.length;
		var height = this.height();
		children.each(function(){
			var item = $(this);
			var title = item.attr("title");
			$(this).panel({
				title:title,
				height:height/size
			});
		});
	};
});

