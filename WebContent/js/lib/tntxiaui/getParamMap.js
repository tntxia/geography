$.fn.getParamMap = function(escapeFlag){
	var res = {};
	this.find(":input").each(function(i,inp){
		
		if(inp.name && inp.name!=""){
			if(escapeFlag){
				res[inp.name] = escape(inp.value);
			}else{
				res[inp.name] = inp.value;
			}
		}
		
	});
	return res;
};