package com.tntxia.geography.action;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.tntxia.dbmanager.DBManager;
import com.tntxia.geography.form.SearchFormBean;
import com.tntxia.web.mvc.BaseAction;
import com.tntxia.web.mvc.PageBean;
import com.tntxia.web.mvc.WebRuntime;

/**
 * 国家管理的Action
 * @author tntxia
 *
 */
public class CountryAction extends BaseAction{
	
	private DBManager dbManager = this.getDBManager();
	
	@SuppressWarnings("rawtypes")
	public Map<String, Object> list(WebRuntime runtime) throws Exception{
		
		int pageSize = 15;
		String sqlWhere = " where region_type='country'";
		
		int count = dbManager.getCount("select count(*) from region " + sqlWhere);
		
		PageBean pageBean = runtime.getPageBean(pageSize);
		int top = pageBean.getTop();
		String sql = "select top "+top+" id,name,name_en from region "+sqlWhere+" order by id desc";
		List list = dbManager.queryForList(sql, true);
		return this.getPagingResult(list, pageBean, count);
	}
	
	public Map<String, Object> add(HttpServletRequest request,
			HttpServletResponse response) throws Exception{
		String name = request.getParameter("name");
		String name_en = request.getParameter("name_en");
		String sql = "insert into country(name,name_en) values(?,?)";
		dbManager.update(sql, new Object[]{name,name_en});
		return this.success();
	}
	
	public Map<String, Object> update(HttpServletRequest request,
			HttpServletResponse response) throws Exception{
		String id = request.getParameter("id");
		String name = request.getParameter("name");
		String name_en = request.getParameter("name_en");
		String sql = "update country set name=?,name_en=? where id = ?";
		dbManager.update(sql, new Object[]{name,name_en,id});
		return this.success();
	}
	
	public Map<String, Object> del(HttpServletRequest request,
			HttpServletResponse response) throws Exception{
		String id = request.getParameter("id");
		String sql = "delete  from country where id = ?";
		dbManager.update(sql, new Object[]{id});
		return this.success();
	}
	
	public Map<String, Object> getPolygon(WebRuntime runtime) throws Exception{
		
		String id = runtime.getParam("id");
		
		String sql = "select top 1 id,polygon from region where id = ?";
		
		Map<String,Object> res = dbManager.queryForMap(sql, new Object[]{id},true);
		
		return res;
		
	}
	
	@SuppressWarnings({ "rawtypes" })
	private void getChildren(Map<String,Object> parent) throws Exception{
		Integer id = (Integer) parent.get("id");
		String sql = "select * from region where parent_id = ?";
		List list = dbManager.queryForList(sql, new Object[]{id},true);
		parent.put("children", list);
		if(list!=null && list.size()>0){
			for(int i=0;i<list.size();i++){
				Map<String,Object> child = (Map<String,Object>)list.get(i);
				getChildren(child);
			}
			
			
		}
	}
	
	
	@SuppressWarnings({ "rawtypes" })
	public List getRegionZTreeList(WebRuntime runtime) throws Exception{
		
		String id = runtime.getParam("id");
		
		String sql = "select id,name from region where id = ?";
		
		Map<String,Object> map = dbManager.queryForMap(sql, new Object[]{id},true);
		getChildren(map);
		
		List res = new ArrayList();
		res.add(map);
		
		return res;
	}

}
