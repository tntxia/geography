
define(['jquery'],function(){

	$.fn.form = function(opt){
		var form = this;
		form.addClass("tntxiaui-form");
		var gap = opt.gap;
		
		if(opt.inputs){
			$.each(opt.inputs,function(i){
				var inp = this;
				var label = $("<span>",{text:this["label"]});
				label.appendTo(form);
				var size = 15;
				if(inp.size){
					size = inp.size;
				}
				var input = null;
				var type = inp.type;
				if(type=="select"){
					
					input = $("<select>",{name:inp["name"]});
					if(inp.opt){
						require(['tntxiaui-dropdown'],function(){
							input.dropdown(inp.opt);
						});
					}
					
				}else if(type=="date"){
					input = $("<span>");
					require(['tntxiaui-datepick'],function(){
						input.datepick({name:inp.name});
					});
				} else{
					var opt = {size:size,name:inp.name,value:inp.value};
					if(type){
						opt.type = type;
					}
					if(inp.disabled){
						opt.disabled = "disabled";
					}
					input = $("<input>",opt);
					
				}
				
				input.appendTo(form);
				
				if(gap){
					form.append(gap);
				}
				
			});
		}
		
		
		if(opt.operations){
			$.each(opt.operations,function(i,data){
				var button = $("<button>",data);
				form.append(button);
			});
		}
		return form;
		
	};

	// 把数据在表格中显示
	$.fn.loadTableData = function(opt,rows){
		
		var cols = opt.cols;
		
		var tbody = this;
		
		function isArray(it) {
			return it && it.toString && it.toString()=== '[object Array]';
		}
			
		function renderByType(type,index){
			if(type=="index"){
				return index+1;
			}
			return "";
		}
			
		if(!rows){
			return;
		}
		
		var totals = [];
		$.each(rows,function(i){
			var tr = $("<tr>");
			tr.hover(function(){
				$(this).find("td").addClass("tntxiaui-datagrid-tr-hover");
			},function(){
				$(this).find("td").removeClass("tntxiaui-datagrid-tr-hover");	
			});
			tr.data("data",this);
			tr.click(opt.trClick);
			
			if(i%2==0)
				tr.addClass("tntxiaui-datagrid-tr-odd");
				
			var d = this;
			
			
			$.each(cols,function(index){
				
				
				
				var col = this;
				
				if(col.type=="hidden"){
					return;
				}
				var td = $("<td>");
				var content;
				if(col.renderer){
					content = col.renderer(d,i);
				}else if(col.edit){
					content = $("<input>",{
						value:d[col.field],
						name:col.field
					});
				}else if(col.type=="index"){
					
					content = i+1;
				}else{
					content = d[col.field];
				}
				
				if(isArray(content)){
					$.each(content,function(i){
						td.append(this);
					});
				}else{
	
					if(col.calTotal){
						
						var contentNum = parseFloat(content);
						
						if(!isNaN(contentNum)){
							var total = 0;
							if(totals[index]){
								total = totals[index];
							}
							total += contentNum;
							totals[index] = total;
						}
						
					}
					td.append(content);
				}
				
				td.appendTo(tr);
			});
			
			tr.appendTo(tbody);
			
		});
		
		if(totals.length){
			var tr = $("<tr>");
			var td = $("<td>",{text:'总计:'});
			var colspan = 0;
			var addPre = false;
			for(var i=0;i<cols.length;i++){
				var cal = totals[i];
				if(!addPre){
					if(!cal && cal!=0){
						colspan++;
					}else {
						if(colspan){
							
							td.attr("colspan",colspan);
							td.attr("align","right");
							tr.append(td);
							addPre = true;
							var td = $("<td>",{
								text:cal.toFixed?cal.toFixed(4):cal
							});
							tr.append(td);
						}
					}
				}else{
					if(!cal){
						cal = "-";
					}
					var td = $("<td>",{
						
						text:cal.toFixed?cal.toFixed(4):cal
					});
					tr.append(td);
				}
				
				
			}
			tr.appendTo(tbody);
		}
		
		
	};

	$.fn.datagrid = function(opt){
		
		// 如果没有参数，无效
		if(arguments.length==0){
			return this;
		}
		
		var datagrid = this;
		
		// 在表格中显示数据
		function loadData(tbody,opt,datagrid,param){
			
			if(!opt.data){
				opt.data ={};
			}
			opt.data.pageSize = opt.pageSize;
			var page = datagrid.data("page");
			if(opt.url){
				
				// 向后台发送请求的参数
				var requestParam = {};
				requestParam.pageSize = opt.pageSize;
				// 如果表格里面有缓存页面，将页面放在发送的参数中
				if(page){
					requestParam.page = page;
				}
				$.extend(requestParam,opt.data);
				if(param){
					$.extend(requestParam,param);
				}
				
				var loading = $("<div><span class='icon-spinner icon-spin'></span> 数据正在加载。。请稍候</div>");
				datagrid.append(loading);
				datagrid.data("param",requestParam);
				$.ajax({
					url:opt.url,
					data:requestParam,
					type:'post',
					success:function(data){
						var rows;
						var pageSize = 0;
						var totalAmount = 0;
						var currentPage = 0;
						var totalPage = 0;
						if($.isArray(data)){
							rows = data;
							totalAmount = data.length;
						}else{
							rows = data.rows;
							pageSize = data.pageSize;
							totalAmount = data.totalAmount;
							if(!totalAmount){
								totalAmount = rows.length;
							}
							currentPage = data.page;
							totalPage = Math.ceil(totalAmount/pageSize);
						}
						
						tbody.loadTableData(opt,rows);
						
						datagrid.data("page",currentPage);
						loadPagingNav(datagrid,currentPage,pageSize,totalAmount,totalPage);
						if(opt.onFinish){
							opt.onFinish();
						}
						if(loading)
							loading.remove();
					}
				});
			}else{
				var rows = opt.dataset.value;
				tbody.loadTableData(opt,rows);
				loadPagingNav(datagrid,0,0,rows.length,0);
			}
			
		}
		
		// 加载分页导航模块
		function loadPagingNav(datagrid,page,pageSize,totalAmount,totalPage){
			var navDiv = null;
			if(datagrid.find(".nav").length>0){
				navDiv = datagrid.find(".nav");
			}else{
				navDiv = $("<div>",{"class":"nav"});
				navDiv.appendTo(datagrid);
			}
			navDiv.empty();
			
			if(pageSize){
				navDiv.append("每页"+pageSize+"条记录，");
			}
			if(totalPage>0)
				navDiv.append("总共"+totalPage+"页，");
			if(page){
				navDiv.append("当前第"+page+"页，");
			}
			
			navDiv.append("总共"+totalAmount+"条记录");
			
			
			if(page){
				// 上一页，当前页数大于1，才可以显示
				if(page>1){
					var prevLink = $("<a>",{
						'class':'prePage',
						text:"上一页",
						click:function(){
							var page = datagrid.data("page");
							if(page<=1){
								return;
							}
							var param = datagrid.data("param");
							if(param){
								param.page = param.page-1;
							}
							datagrid.datagrid("reload",param);
						}
					});
					
					prevLink.appendTo(navDiv);
				}
				
				// 当前页数小于总页数
				if(page<totalPage){
					var nextLink = $("<a>",{
						'class':'nextPage',
						text:"下一页",
						click:function(){
							var param = datagrid.data("param");
							if(param){
								param.page = param.page+1;
							}
							datagrid.datagrid("reload",param);
						}
					});
					nextLink.appendTo(navDiv);
				}
				
				if(totalPage>1){
					var pageJump = $("<input>",{
						value:page+1
					});
					pageJump.attr("size",3);
					navDiv.append(pageJump);
					var jumpButton = $("<button>",{
						text:'转页',
						click:function(){
							var pageJump = $(this).data("pageJump");
							var param = datagrid.data("param");
							if(param){
								param.page = pageJump.val();
							}
							datagrid.datagrid("reload",opt.data);
						}
					});
					jumpButton.data("pageJump",pageJump);
					navDiv.append(jumpButton);
				}
				
			}
			
			
		}
		
		var page = 1;
		var tbody;
		if(typeof arguments[0] ==="object"){
			tbody = $("<tbody>",{"class":"tntxia-ui-datagrid-databody"});
			this.empty();
			this.data("opt",opt);
			this.addClass('tntxiaui-datagrid');
			this.data("page",page);
			this.data("tbody",tbody);
			if(opt.height){
				this.css("height",opt.height);
			}
			if(opt.title){
				var headerDiv = $("<div>",{'class':'panel-header'});
				var titleDiv = $("<div>",{'class':'panel-title',text:opt.title});
				headerDiv.append(titleDiv);
				this.append(headerDiv);
			}
			if(opt.operations){
				
				var divOperations = $("<div>");
				$.each(opt.operations,function(i,o){
					if(i!=0){
						divOperations.append(" | ");
					}
					if(!o.text){
						o.text = o.label;
					}
					var link = $("<a>",$.extend({"href":"#"},o));
					link.appendTo(divOperations);
					
				});
				divOperations.appendTo(this);
			}
			
			var divContent = $("<div>");
			
			if(opt.form){
				var form = $("<div>");
				form.form(opt.form);
				divContent.append(form);
			}
			
			var table = $("<table>",{width:'100%'});
			table.appendTo(divContent);
			
			divContent.appendTo(this);
			
			var header = $("<tr>");
			
			if(opt.cols){
				$.each(opt.cols,function(i){
					var col = this;
					if(col.type!="hidden"){
						var h = $("<th>",{text:col.label});
						h.appendTo(header);
					}
				});
			}
			
			header.appendTo(table);
			tbody.appendTo(table);
			loadData(tbody,opt,datagrid);
		}else{
			var action = arguments[0];
			if(action=="reload"){
				var reloadData = arguments[1];
				opt = this.data("opt");
				tbody = this.data("tbody");
				tbody.empty();
				loadData(tbody,opt,datagrid,reloadData);
			}
			
		}
		
		
	};
});
