define(['tntxiaui-datagrid'],function(){
	// 生成Crud界面
	$.fn.crud = function(opt){
		
		if(opt=="reload"){
			this.data("datagrid").datagrid('reload');
			return;
		}
		
		var target = this;
		var cols = opt.cols;
		var idField = "id";
		if(opt.idField){
			idField = opt.idField;
		}
		
		if(opt && opt.hasOwnProperty("useRightButton")){
			useRightButton = opt.useRightButton;
		}
		if(!opt.update && !opt.del){
			useRightButton = false;
		}
		if(opt.rightButtons){
			useRightButton = true;
		}
		
		var dialog = null;
		
		function setDefaultTemplate(content,datagrid,rowData){
			
			var isUpdate = rowData && rowData.id;
			
			var type = null;
			if(isUpdate){
				type = "修改";
			}else{
				type = "增加";
			}
			
			var formOpt = {};
			formOpt.gap = "<br>";
			formOpt.inputs = [];
			formOpt.operations =[{
				text:type,
				click:function(){
					var but = this;
					require(['tntxiaui-getParamMap'],function(){
						var params = $(but).parent().getParamMap();
						var url = null;
						if(isUpdate){
							url = opt.update.url;
						}else{
							url = opt.create.url;
						}
						
						if(isUpdate){
							params = $.extend(opt.update.data,params);
						}else{
							params = $.extend(opt.create.data,params);
						}
						
						$.ajax({
							url:url,
							type:'post',
							data:params,
							success:function(data){
								datagrid.datagrid('reload');
								if(dialog)
									dialog.remove();
							}
						});
					});
					
				}
			}];
			
			$.each(cols,function(i,col){
				
				var isIdField = col.field===idField;
				
				if(isIdField){
					if(isUpdate){
						formOpt.inputs.push({
							label:col.label,
							name:col.field,
							type:"hidden",
							value:rowData[col.field]
						});
					}
				}else{
					if(col.field){
						formOpt.inputs.push({
							label:col.label,
							name:col.field,
							value:rowData[col.field],
							type:col.type,
							opt:col.opt
						});
					}
					
				}
				
			});
			content.form(formOpt);
		}
		
		function setTemplate(content,tempate,rowData,onFinish){
			content.loadPage({
				url:tempate,
				templateData:rowData,
				onFinish:onFinish
			});
			
		}
		
		// 弹出增加或更新的窗口
		function toAddOrUpdate(rowData){
			
			require(['tntxiaui-dialog'],function(){
				var content = $("<div>");
				dialog = $.dialog({
					width:500,
					height:500,
					content:content
				});
				
				var datagrid = target.data("datagrid");
				
				var isUpdate = rowData && rowData.id;
				
				if(isUpdate && opt.update  && opt.update.template ){
					setTemplate(content,opt.update.template,rowData,opt.update.onFinish);
				}else if(!isUpdate && opt.create && opt.create.template){
					setTemplate(content,opt.create.template,rowData,opt.create.onFinish);
				}else{
					setDefaultTemplate(content,datagrid,rowData);
				}
			});
			
			
		}
		
		var inputs = [];
		
		if(opt.search){
			if(opt.search.cols){
				$.each(opt.search.cols,function(i,col){
					var isIdField = col.field===idField;
					if(!isIdField){
						col.name = col.field;
						inputs.push(col);
					}
				});
			}
			
		}else{
			if(cols){
				$.each(cols,function(i,col){
					var isIdField = col.field===idField;
					if(!isIdField){
						col.name = col.field;
						inputs.push(col);
					}
				});
			}
		}
		
		var operations = [];
		
		var datagrid = $("<div>");
		target.data("datagrid",datagrid);
		
		if(opt.search){
			operations.push({
				text:'查询',
				click:function(){
					var but = this;
					require(['tntxiaui-getParamMap'],function(){
						var params = $(but).parent().getParamMap();
						datagrid.datagrid('reload',params);
					});
					
				}
			});
			
			if(opt.search.otherButtons && opt.search.otherButtons.length){
				$.each(opt.search.otherButtons,function(i,d){
					operations.push(d);
				});
				
			}
		}
		
		if(opt.create){
			operations.push({
				text:'增加',
				click:function(){
					toAddOrUpdate('增加');
				}
			});
		}
		
		if(opt.operations){
			operations = operations.concat(opt.operations);
		}
		
		var optList = opt.list;
		if(!optList){
			optList = {};
		}
		
		optList.form = {};
		if(opt.search){
			optList.form.inputs = inputs;
		}
		optList.form.operations = operations;
		
		var listCols = $.extend([],opt.cols);
		
		var rightButtons = [];
		
		if(opt.update){
			var buttonModify = {
				text:'修改',
				click:function(){
					var rowData = $(this).parent().parent().data("data");
					toAddOrUpdate(rowData);
				}
			};
			rightButtons.push(buttonModify);
		}
		
		if(opt.del){
			var buttonDel = {
				text:'删除',
				click:function(){
					var rowData = $(this).parent().parent().data("data");
					$.ajax({
						url:opt.del.url,
						data:$.extend(opt.del.data,rowData),
						success:function(data){
							if(data.success){
								alert("操作成功");
								datagrid.datagrid('reload');
							}else{
								alert("操作失败");
							}
						}
					});
				}
			};
			
			rightButtons.push(buttonDel);
		}
		
		if(opt.rightButtons && opt.rightButtons.length){
			$.each(opt.rightButtons,function(i,b){
				rightButtons.push(b);
			});
		}
		
		if(rightButtons && rightButtons.length){
			listCols.push({
				label:'操作',
				renderer:function(){
					return $.map(rightButtons,function(b){
						return $("<button>",b);
					});
					
				}
			});
		}
		
		
		optList.cols = listCols;
		if(!optList.title){
			optList.title = opt.title;
		}
		if(!optList.url){
			optList.url = opt.url;
		}
		if(!optList.data){
			optList.data = opt.data;
		}
		
		
		datagrid.datagrid(optList);
		this.append(datagrid);
	};
});