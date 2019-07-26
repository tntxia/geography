package com.tntxia.geography.action;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang.StringUtils;

import com.tntxia.dbmanager.DBManager;
import com.tntxia.web.mvc.BaseAction;

/**
 * 城市管理的Action
 * @author tntxia
 *
 */
public class CityAction extends BaseAction{
	
	private DBManager dbManager = this.getDBManager();
	
	@SuppressWarnings("rawtypes")
	public Map<String, Object> list(HttpServletRequest request,
			HttpServletResponse response) throws Exception{
		
		String provinceId = request.getParameter("provinceId");
		String sql = "select c.id, c.name,c.name_en,p.name provinceName from city c left outer join province p on c.province_id = p.id ";
		
		
		List<Object> params = new ArrayList<Object>();
		if(StringUtils.isNotEmpty(provinceId)){
			sql += " where province_id = ?";
			params.add(provinceId);
		}
		
		
		List list = dbManager.queryForList(sql,params,true);
		Map<String,Object> res = new HashMap<String,Object>();
		res.put("rows", list);
		return res;
	}
	
	public Map<String, Object> add(HttpServletRequest request,
			HttpServletResponse response) throws Exception{
		String name = request.getParameter("name");
		String name_en = request.getParameter("name_en");
		String province_id = request.getParameter("province_id");
		String sql = "insert into city(name,name_en,province_id) values(?,?,?)";
		dbManager.update(sql, new Object[]{name,name_en,province_id});
		return this.success();
	}

}
