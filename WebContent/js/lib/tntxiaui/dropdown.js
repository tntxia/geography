$.fn.dropdown = function(opt){
	var sel = this;
	sel.empty();
	if(opt.defaultOption){
		sel.append($("<option>",opt.defaultOption));
	}
	var dataset = opt.dataset;
	var valueField = dataset.field;
	
	
	sel.on("change",function(){
		var list = sel.data("list");
		var data=null;
		console.log(sel.val());
		console.log(valueField);
		for(var i=0;i<list.length;i++){
			var item = list[i];
			if(item[valueField]==sel.val()){
				data = item;
				sel.data("data",data);
				break;
			}
		}
		if(opt.onChange){
			opt.onChange(data);
		}
	});
	
	if($.isArray(dataset)){
		$.each(dataset,function(i,data){
			if(!data.value){
				data.value = data.text;
			}
			var option = $("<option>",data);
			sel.append(option);
		});
		sel.data("list",dataset);
	}else{
		var ajaxOption = $.extend({
			success:function(data){
				var arr = null;
				if(data.rows){
					arr = data.rows;
				}else{
					arr = data;
				}
				$.each(arr,function(i){
					var d = this;
					var option = $("<option>",{value:d[dataset.field],text:d[dataset.label]});
   					sel.append(option);
				});
				sel.data("list",arr);
				if(opt.onChange){
					opt.onChange(arr[0]);
				}
			}
		},dataset);
		$.ajax(ajaxOption);
	}
};