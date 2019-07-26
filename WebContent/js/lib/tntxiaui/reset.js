$.fn.reset = function(escapeFlag){
	this.find(":input").each(function(i){
		var inp = $(this);
		var data = inp.data("data");
		if(data){
			inp.data("data",null);
		}
		inp.val("");
	});
};