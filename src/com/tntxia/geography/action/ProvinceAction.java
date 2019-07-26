package com.tntxia.geography.action;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.tntxia.dbmanager.DBManager;
import com.tntxia.web.mvc.BaseAction;

/**
 * 省份管理的Action
 * @author tntxia
 *
 */
public class ProvinceAction extends BaseAction{
	
	private DBManager dbManager = this.getDBManager();
	
	@SuppressWarnings("rawtypes")
	public Map<String, Object> list(HttpServletRequest request,
			HttpServletResponse response) throws Exception{
		
		String sql = "select p.id,p.name,p.name_en,c.name countryName from province p left outer join " +
				"country c on p.country_id = c.id";
		List list = dbManager.queryForList(sql, true);
		Map<String,Object> res = new HashMap<String,Object>();
		res.put("rows", list);
		return res;
		
	}
	
	public Map<String, Object> add(HttpServletRequest request,
			HttpServletResponse response) throws Exception{
		String name = request.getParameter("name");
		String name_en = request.getParameter("name_en");
		String country_id = request.getParameter("country_id");
		String sql = "insert into province(name,name_en,country_id) values(?,?,?)";
		dbManager.update(sql, new Object[]{name,name_en,country_id});
		return this.success();
	}
	
	public Map<String, Object> del(HttpServletRequest request,
			HttpServletResponse response) throws Exception{
		String id = request.getParameter("id");
		
		String sql = "delete from province where id = ?";
		dbManager.update(sql, new Object[]{id});
		return this.success();
	}

}
