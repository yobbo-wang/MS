package wang.yobbo.sys.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wang.yobbo.sys.dao.SysMenuDao;
import wang.yobbo.sys.entity.SysMenu;
import wang.yobbo.sys.service.SysMenuService;

import java.util.ArrayList;
import java.util.List;

@Service
public class SysMenuServiceImpl implements SysMenuService {
    @Autowired
    private SysMenuDao sysMenuDao;

    //使用懒加载
    public List<SysMenu> findByPId(String pid) {
        List<SysMenu> menus = this.sysMenuDao.findByPId(pid);
        return menus;
    }
}
