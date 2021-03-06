package wang.yobbo.common.httpengine.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.lang3.StringUtils;
import org.jetbrains.annotations.Contract;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import wang.yobbo.common.spring.SpringContextUtil;
import wang.yobbo.sys.entity.SysMenu;
import wang.yobbo.sys.entity.SysMenuTable;
import wang.yobbo.sys.service.SysMenuService;

import java.util.Map;

public class EngineDataManagerFacade {
    private EngineDataManagerFacade(){}
    private static final Logger LOG     = LoggerFactory.getLogger(EngineDataManagerFacade.class);
    private final static EngineDataManagerFacade instance       = new EngineDataManagerFacade();
    @Contract(pure = true)
    public static EngineDataManagerFacade getInstance(){
        return instance;
    }

    /**
     * 处理首页信息
     * @param basicInfo
     * @return
     */
    public Object getIndexInfo(Map<String,Object> basicInfo) {
        return basicInfo;
    }

    /**
     * 处理菜单信息
     * @param basicInfo
     * @return
     */
    public Object getMenuInfo(Map<String,Object> basicInfo) {
        try{
            String id = basicInfo.get("id") != null ? basicInfo.get("id").toString() : null;
            if(StringUtils.isNotEmpty(id)){
                SysMenuService sysMenuService = SpringContextUtil.getBean(SysMenuService.class); //获取SysMenuService bean
                SysMenu sysMenu = sysMenuService.findById(id);
                ObjectMapper mapper = new ObjectMapper();
                try {
                    String json = mapper.writeValueAsString(sysMenu);
                    basicInfo.put("sysMenu", json);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        }catch (Exception e){
            e.printStackTrace();
            LOG.error("应用引擎查询菜单信息错误: {}", e.getMessage());
        }
        return basicInfo;
    }

    /**
     * 获取实体信息
     * @param basicInfo
     * @return
     */
    public Object getMenuTableInfo(Map<String,Object> basicInfo) {
        try{
            String id = basicInfo.get("id") != null ? basicInfo.get("id").toString() : null;
            if(StringUtils.isNotEmpty(id)){
                SysMenuService sysMenuService = SpringContextUtil.getBean(SysMenuService.class); //获取SysMenuService bean
                SysMenuTable sysMenuTable = sysMenuService.findSysMenuTableById(id);
                ObjectMapper mapper = new ObjectMapper();
                try {
                    String json = mapper.writeValueAsString(sysMenuTable);
                    basicInfo.put("sysMenuTable", json);
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            }
        }catch (Exception e){
            e.printStackTrace();
            LOG.error("应用引擎查询实体信息错误: {}", e.getMessage());
        }
        return basicInfo;
    }
}
