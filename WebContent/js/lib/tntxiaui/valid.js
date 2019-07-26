$.fn.valid = function(){
	
	var res = true;
	$(":input",this).each(function(i){
		
		var input = $(this);
		
		// 
		if(input.prop("required")){
			if(!input.val() || input.val()===""){
				res = false;
				input.addClass("tntxia-ui-input-error");
				return;
			}
		}
		
		var validators = input.data("validators");
		if(!validators || !validators.length){
			return;
		}
		$.each(validators,function(i,valid){
			
			if(valid(input)){
				input.removeClass("tntxia-ui-input-error");
			}else{
				res = false;
				input.addClass("tntxia-ui-input-error");
			}
		});
		
	});
	return res;
	
};