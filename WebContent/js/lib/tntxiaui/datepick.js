

$.fn.datepick = function(opt){
	
	var picker = this;
	
	
	function buildCalendar(div){
		
		div.css({
			position:'absolute',
			width:200,
			border:'1px solid rgb(149, 184, 231)'
		});
		
		var head = $("<div>");
		var addButton = $("<button>",{
			text:'+',
			click:function(){
				var yearInput = $(this).next();
				var year = yearInput.val();
				yearInput.val(parseInt(year,10)+1);
				buildDate();
			}
		});
		var yearInput = $("<input>",{
			type:'text',
			width:50,
			readonly:"readonly"
		});
		div.data("year",yearInput);
		var subButton = $("<button>",{
			text:'-',
			click:function(){
				var yearInput = $(this).prev();
				var year = yearInput.val();
				yearInput.val(parseInt(year,10)-1);
				buildDate();
			}
		});
		
		var monthSel = $("<select>",{
			id:"tntxia-ui-popup-dialog-month-sel",
			change:function(){
				buildDate();
			}
		});
		div.data("month",monthSel);
		
		for(var i=1;i<=12;i++){
			var opt = $("<option>",{text:i,value:i});
			monthSel.append(opt);
		}
		
		addButton.appendTo(head);
		yearInput.appendTo(head);
		subButton.appendTo(head);
		monthSel.appendTo(head);
		
		div.append(head);
		
		var table = $("<table>");
		
		tr = $("<tr>");
		
		var dayArr = ["日","一","二","三","四","五","六"];
		$.each(dayArr,function(i,day){
			var td = $("<th>",{text:day,"class":"tntxia-ui-popup-dialog-item"});
			td.appendTo(tr);
		});
		tr.appendTo(table);
        var dateLineDiv = $("<tbody>",{'class':"calendar-body"});
        dateLineDiv.appendTo(table);
        div.append(table);
		div.data("body",dateLineDiv);
	}
	
	function buildDate(div){
		
		var tbody = div.data("body");
		tbody.empty();
		
		var year = parseInt(div.data("year").val(),10);
		var month = parseInt(div.data("month").val(),10);    //本月
		var day = -1;            //本日
		var today = new Date();
		if(year == today.getFullYear() && month == today.getMonth()+1){
			day = today.getDate();           
		}
		
		var target = $("#tntxia-ui-popup-dialog").data("target");
		var fillDate = _getFillDate(target);
		
		var inputFillDate = -1;
		if(fillDate && year == fillDate.getFullYear() && month == fillDate.getMonth()+1){
			inputFillDate = fillDate.getDate();
		}
		
        //本月第一天是星期几（距星期日离开的天数）
        var startDay = new Date(year, month - 1, 1).getDay();
        
        //本月有多少天(即最后一天的getDate()，但是最后一天不知道，我们可以用“上个月的0来表示本月的最后一天”)
        var nDays = new Date(year, month, 0).getDate();
		
		var dateLine = $("<tr>",{"class":"tntxia-ui-popup-dialog-dateline"});
        
        //开始画日历
        var numRow = 0;  //记录行的个数，到达7的时候创建div
        
        for (var i = 0; i < startDay; i++) {

            var aDate = $("<td>",{"class":"tntxia-ui-popup-dialog-emptyitem"});
            aDate.appendTo(dateLine);
            numRow++;

        }
        
        for (var j = 1; j <= nDays; j++) {
        	
        	var aDate = $("<td>",{text:j});
            //如果是今天则显示红色
            if (j == day) {
            	aDate.addClass("tntxia-ui-popup-dialog-todayitem");
            } else if(j == inputFillDate){
            	aDate.addClass("tntxia-ui-popup-dialog-filldateitem");
            }else {
            	aDate.addClass("tntxia-ui-popup-dialog-commonitem");
            }
            aDate.click(function(){
            	var target = div.data("target");
            	var year = div.data("year").val();
            	var month = div.data("month").val();
            	var selectDate = year+"-"+month+"-"+$(this).text();
            	target.val(selectDate);
            	$(this).addClass("tntxia-ui-popup-dialog-clickitem");
            	var lastClick = div.data("lastClick");
            	if(lastClick){
            		lastClick.removeClass("tntxia-ui-popup-dialog-clickitem");
            	}
            	div.data("lastClick",$(this));
            });
            aDate.appendTo(dateLine);
            numRow++;

            if (numRow == 7) {  //如果已经到一行（一周）了，重新创建div
                numRow = 0;
                dateLine.appendTo(tbody);
                dateLine = $("<tr>",{"class":"tntxia-ui-popup-dialog-dateline"});

            }
        }
        
        dateLine.appendTo(tbody);
	}
	
	function _getFillDate(target){
		var fillDate = $(target).val();
		if(!fillDate || $.trim(fillDate) == ""){
			return null;
		}
		var arr = fillDate.split("-");
		return new Date(parseInt(arr[0],10),parseInt(arr[1],10)-1,parseInt(arr[2],10));
	}
	
	var showNowDate = opt?opt.showNowDate:true;
	if(showNowDate){
		var now = new Date();
		$(picker).val(now.getFullYear()+"-"+(now.getMonth()+1)+"-"+now.getDate());
	}
	
	var img = $("<span></span>",{"class":"icon-calendar"});
	img.css("cursor","pointer");
	if(picker[0].tagName=="INPUT"){
		img.data("target",picker);
		img.insertAfter(picker);
	}else{
		var input = $("<input>",{name:opt.name});
		img.data("target",input);
		this.append(input);
		this.append(img);
	}
	
	$(document).click(function(e) {
		if(picker.data("popup")){
			picker.data("popup").hide();
		}
	});
	
	function stopPropagation(e) {
        if (e.stopPropagation)
            e.stopPropagation();
        else
            e.cancelBubble = true;
    }
	
	img.click(function(e){
		stopPropagation(e);
		var div = null;
		if(picker.data("popup")){
			div = picker.data("popup");
		}else{
			div = $("<div>");
			buildCalendar(div);
			div.appendTo($("body"));
			div.data("target",picker);
			picker.data("popup",div);
		}
		// var div = $("#tntxia-ui-popup-dialog");
		var target = $(this).data("target");
		var fillDate = _getFillDate(target);     // 文本框里面的日期
		if(!fillDate){
			fillDate = new Date();
		}
		
		var year = fillDate.getFullYear();      //本年
        var month = fillDate.getMonth() + 1;    //本月
		
        div.css({
        	top:picker.offset().top+picker.outerHeight(),
        	left:picker.offset().left
        });
		div.show();
		
		div.data("year").val(year);
		$("#tntxia-ui-popup-dialog-month-sel option:nth-child("+month+")").attr("selected","selected");
		$("#tntxia-ui-popup-dialog").data("target",target);
		
		buildDate(div);
		
	});
	
};