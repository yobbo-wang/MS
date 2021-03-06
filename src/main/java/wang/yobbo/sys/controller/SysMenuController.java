package wang.yobbo.sys.controller;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import wang.yobbo.common.appengine.InvokeResult;
import wang.yobbo.sys.entity.SysMenu;
import wang.yobbo.sys.entity.SysMenuTable;
import wang.yobbo.sys.service.SysMenuService;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Controller
@RequestMapping("menu")
public class SysMenuController {

    @Autowired
    private SysMenuService sysMenuService;

    @RequestMapping(value = "findByPId", method = RequestMethod.POST)
    @ResponseBody
    public List<SysMenu> findByPId(HttpServletRequest request){
        String pid = new String();
        if(request.getParameter("PID") != null || StringUtils.isNotEmpty(request.getParameter("PID"))){
            pid = request.getParameter("PID");
        }
        List<SysMenu> menus = this.sysMenuService.findByPId(pid);
        return menus;
    }

    @RequestMapping(value = "save", method = RequestMethod.POST)
    @ResponseBody
    public InvokeResult save(SysMenu sysMenu){
        try{
            if(StringUtils.isEmpty(sysMenu.getParent_id())){
                sysMenu.setParent_id(null);
            }
            this.sysMenuService.save(sysMenu);
            return InvokeResult.success("保存成功!");
        }catch (Exception e){
            e.printStackTrace();
            return InvokeResult.failure("保存失败!");
        }
    }

    @RequestMapping(value = "addEntity", method = RequestMethod.POST)
    @ResponseBody
    public InvokeResult addEntity(SysMenuTable sysMenuTable){
        try{
            if(StringUtils.isEmpty(sysMenuTable.getMenu_id())){
                return InvokeResult.failure("请选择对应菜单，再添加实体!");
            }
            this.sysMenuService.addEntity(sysMenuTable);
            return InvokeResult.success("保存成功!");
        }catch (Exception e){
            e.printStackTrace();
            return InvokeResult.failure("保存失败!");
        }
    }

    @RequestMapping(value = "deleteEntity", method = RequestMethod.POST)
    @ResponseBody
    public InvokeResult deleteEntity(@RequestParam(value="id") String id){
        try{
            int count = this.sysMenuService.deleteEntity(id);
            return InvokeResult.success("已删除" + count + "条记录!");
        }catch (Exception e){
            e.printStackTrace();
            return InvokeResult.failure("删除失败!");
        }
    }

    @RequestMapping(value = "delete", method = RequestMethod.POST)
    @ResponseBody
    public InvokeResult delete(@RequestParam(value="id") String id){
        try{
            int count = this.sysMenuService.delete(id);
            return InvokeResult.success("已删除" + count + "条记录!");
        }catch (Exception e){
            e.printStackTrace();
            return InvokeResult.failure("删除失败!");
        }
    }
}
