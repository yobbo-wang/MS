package wang.yobbo.common.httpengine.service;

import com.alibaba.druid.VERSION;
import com.alibaba.druid.util.Utils;
import org.jetbrains.annotations.Contract;
import wang.yobbo.common.httpengine.http.EngineViewServlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.jar.JarFile;
import java.util.zip.ZipEntry;

public class EngineDataManagerFacade {
    private EngineDataManagerFacade(){}
    private final static EngineDataManagerFacade instance       = new EngineDataManagerFacade();
    @Contract(pure = true)
    public static EngineDataManagerFacade getInstance(){
        return instance;
    }

    /**
     * 获取code中的数据
     * 需要参数:
     * 		1) templatePath >> 比如 ：templatePath=/oracle/hibernate/entity.ftl，对应ftl在模板中的位置
     * 		2) prefix >> 比如：prefix=engine/http/resources/template，模板在 jar包中的位置
     * 	    3) 不是模板情况 java_base_path >> 比如：E:/电影网站模板/FrontMusik/FrontMusikEngine/src/main/java/tech/yobbo/index/service/IndexService.java
     * * @param parameters
     * @return
     */
    public Map getCodeInfo(Map<String, String> parameters) {
        Map<String,Object> data = new HashMap<String, Object>();
        if(parameters.containsKey("prefix") && parameters.containsKey("templatePath")){
            String prefix = parameters.get("prefix") != null ? parameters.get("prefix") : "";
            if(!"".equals(EngineViewServlet.getJar_path()) && !"".equals(prefix)){
                try {
                    String templatePath = parameters.get("templatePath") != null ? parameters.get("templatePath") : "";
                    JarFile jar = new JarFile(EngineViewServlet.getJar_path());
                    ZipEntry entry =  jar.getEntry(prefix+templatePath);
                    InputStream in = jar.getInputStream(entry);
                    String text = Utils.read(in);
                    data.put("code",text);
                    data.put("readOnly",parameters.get("readOnly"));
                    in.close();
                    jar.close();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }else if(parameters.containsKey("java_base_path")){
            String filepath = parameters.get("java_base_path");
            try {
                filepath = URLDecoder.decode(filepath,"utf-8");
                File file = new File(filepath);
                InputStream in = new FileInputStream(file);
                String text = Utils.read(in);
                data.put("code",text);
                data.put("readOnly",parameters.get("readOnly"));
                in.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
        return data;
    }

    /**
     * 获取首页基础数据
     */
    public Map getBasicInfo(Map<String,String> params){
        Map<String,Object> dataMap = new LinkedHashMap<String,Object>();
        dataMap.put("Version", VERSION.getVersionNumber());
        return dataMap;
    }

}
