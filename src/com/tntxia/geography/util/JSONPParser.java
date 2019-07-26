package com.tntxia.geography.util;

import java.util.Map;


import com.alibaba.fastjson.JSON;

public class JSONPParser {
	
	@SuppressWarnings("rawtypes")
	public static Map parseJSONP(String jsonp){
		
		int startIndex = jsonp.indexOf("(");
		int endIndex = jsonp.lastIndexOf(")");
		String json = jsonp.substring(startIndex+1, endIndex);
		
		return JSON.parseObject(json);
	}
	
	

}
