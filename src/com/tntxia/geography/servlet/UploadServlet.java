package com.tntxia.geography.servlet;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.fileupload.FileItem;
import org.apache.commons.fileupload.FileUploadBase.FileSizeLimitExceededException;
import org.apache.commons.fileupload.FileUploadException;
import org.apache.commons.fileupload.disk.DiskFileItemFactory;
import org.apache.commons.fileupload.servlet.ServletFileUpload;

import com.tntxia.dbmanager.DBManager;
import com.tntxia.geography.util.JSONPParser;
import com.tntxia.web.util.DatasourceStore;

/**
 * Servlet implementation class UploadServlet
 */
@WebServlet(description = "File Upload", urlPatterns = { "/upload.do" })
public class UploadServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;

	/**
	 * @see HttpServlet#HttpServlet()
	 */
	public UploadServlet() {
		super();
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	@SuppressWarnings("rawtypes")
	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {

		request.setCharacterEncoding("utf-8");// 防止中文名乱码
		int sizeThreshold = 1024 * 6; // 缓存区大小
		String basePath = this.getServletContext().getRealPath("/upload/");
		File repository = new File(basePath); // 缓存区目录
		// long sizeMax = 1024 * 1024 * 2;//设置文件的大小为2M
		// final String allowExtNames = "jpg,gif,bmp,rar,rar,txt,docx";
		DiskFileItemFactory diskFileItemFactory = new DiskFileItemFactory();
		diskFileItemFactory.setRepository(repository);
		diskFileItemFactory.setSizeThreshold(sizeThreshold);
		ServletFileUpload servletFileUpload = new ServletFileUpload(diskFileItemFactory);
		// servletFileUpload.setSizeMax(sizeMax);

		List<FileItem> fileItems = null;
		try {
			fileItems = servletFileUpload.parseRequest(request);
			
			String id=null;
			
			String jsontext=null;

			for (FileItem fileItem : fileItems) {
				
				if(fileItem.isFormField() && fileItem.getFieldName().equals("id")){
					id = fileItem.getString();
				}

				if(fileItem.getFieldName().equals("jsonpFile")){
					jsontext = fileItem.getString();
					
					
				}

			}
			
			if(id!=null && jsontext!=null){
				
				DBManager dbManager = new DBManager(DatasourceStore.getDatasource("default"));
				
				Map map = JSONPParser.parseJSONP(jsontext);
				
				List districts = (List)map.get("districts");
				
				Map china = (Map) districts.get(0);
				
				String polyline = (String) china.get("polyline");
				
				String sql = "update region set polygon=? where id = ?";
				dbManager.update(sql,new Object[]{polyline,id});
			}
			
			
		} catch (FileSizeLimitExceededException e) {
			System.out.println("file size is not allowed");
		} catch (FileUploadException e1) {
			e1.printStackTrace();
		}

	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse
	 *      response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
