define(['jquery'],function(){
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
});