$.fn.combox = function(opt, param) {

	if (typeof opt == "string") {// 如果是字符串，调用函数
		return $.fn.combox.methods[opt](this, param);
	}

	var span = $("<span>", {
		'class' : 'tntxiaui-combo'
	});
	
	// 原来的表单元素隐藏
	var org = this;
	org.wrap(span);
	org.hide();

	// 增加一个输入框
	var box = $("<input>",{required:org.attr("required")});
	box.insertAfter(org);
	box.data("org",org);
	
	org.data("combox",box);
	
	var dropdownBtn = $("<a class='tntxiaui-btn'><span class='icon-angle-down'></span></a>");

	dropdownBtn.insertAfter(box);

	var validators = [];
	var valid = function(input) {
		
		// 如果没有填写，无需校验
		if (!input.val() || input.val() == "") {
			return true;
		}
		
		var org = input.data("org");
		if(!org.val() || org.val()==""){
			input.attr("title", "输入值无效");
			return false;
		}
		return true;
		
	};
	validators.push(valid);
	box.data("validators", validators);

	box.data("field", opt.field);

	$("body").click(function(e) {
		if ($(e.target).html() != box.html()) {
			if (box.data("dropdown"))
				box.data("dropdown").hide();
		}
	});

	var onChange = opt.onChange;

	// 是否服务端查询
	var remote = opt.remote;

	var source = {};
	source.textField = opt.dataset.text;
	source.valueField = opt.dataset.value;
	box.data("source", source);

	function applyValue(data,valueField) {
		var value = data[valueField];
		box.data("org").val(value);
		if(onChange)
			onChange(data);
	}

	function fillData(dropdownDiv, onChange,showAll) {
		var source = box.data("source");
		var textField = source.textField;
		var valueField = source.valueField;
		dropdownDiv.empty();
		var list = box.data("list");
		$.each(list, function(i, d) {
			var text = d[textField];
			var val = box.val();
			if (text.indexOf(val) >= 0 || showAll) {
				var div = $("<div>", {
					text : text
				});
				div.data("data", d);
				div.css({
					border : '1px solid red',
					cursor : 'pointer'
				});
				dropdownDiv.append(div);
				div.click(function() {
					var clickItem = $(this);
					box.val(clickItem.text());
					var data = clickItem.data("data");
					applyValue(data,valueField);

				});
			}
		});
	}

	function fetchData(dropdownDiv, dataset, onChange,showAll) {
		var val = box.val();
		var org = box.data("org");
		var name = org.attr("name");
		var requestOpt = {};
		requestOpt.url = dataset.url;
		requestOpt.type = "post";
		
		requestOpt.data = {};
		$.extend(true,requestOpt.data,dataset.data);
		
		// 如果是ShowAll，不要传参数过去
		if(!showAll){
			requestOpt.data[name] = val;
		}

		requestOpt.success = function(data) {
			box.data("status", "finish");
			var list = data;
			if (data.rows) {
				list = data.rows;
			}
			box.data("list", list);
			fillData(dropdownDiv, onChange,showAll);

		};
		$.ajax(requestOpt);
	}

	function dropdown(remote,showAll) {

		box.data("value", null);
		var dropdownDiv = null;
		if (!box.data("dropdown")) {
			var position = box.offset();
			dropdownDiv = $("<div>", {
				width : box.width(),
				height : 100
			});
			dropdownDiv.css({
				background : 'yellow',
				overflow : 'auto'
			});
			dropdownDiv.css({
				position : 'absolute',
				top : position.top + box.outerHeight() + 2,
				left : position.left
			});
			dropdownDiv.appendTo($("body"));
			box.data("dropdown", dropdownDiv);
		} else {
			dropdownDiv = box.data("dropdown");
			dropdownDiv.show();
		}

		var dataset = opt.dataset;

		if (remote) {
			fetchData(dropdownDiv, dataset, opt.onChange,showAll);
		} else {
			var status = box.data("status");
			if (!status) {
				fetchData(dropdownDiv, dataset, opt.onChange,showAll);
			} else if (status == "finish") {
				fillData(dropdownDiv, opt.onChange,showAll);
			}
		}
	}

	box.keyup(function() {
		dropdown(remote);
	});

	box.click(function() {
		dropdown();
	});

	dropdownBtn.click(function() {
		dropdown(remote,true);
	});

	box.blur(function() {
		box.data("data", null);
		var val = box.val();
		var list = box.data("list");
		if (list) {

			var textField = source.textField;
			var valueField = source.valueField;

			for ( var i = 0; i < list.length; i++) {
				var item = list[i];
				if (item[textField] == val) {
					
					applyValue(item,valueField);
					break;
				}
			}

		}

	});
};

// combox里面的方法
$.fn.combox.methods = {
	setList : function(jq, list) {
		var box = jq.data("combox");
		box.data("list", list);
		box.data("status", "finish");
	}
};