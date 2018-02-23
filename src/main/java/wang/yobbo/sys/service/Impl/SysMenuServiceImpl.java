package wang.yobbo.sys.service.Impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wang.yobbo.sys.dao.SysMenuDao;
import wang.yobbo.sys.dao.SysMenuTableDao;
import wang.yobbo.sys.entity.SysMenu;
import wang.yobbo.sys.entity.SysMenuTable;
import wang.yobbo.sys.service.SysMenuService;

import java.util.List;

@Service
public class SysMenuServiceImpl implements SysMenuService {
    @Autowired
    private SysMenuDao sysMenuDao;

    @Autowired
    private SysMenuTableDao sysMenuTableDao;

    //使用懒加载
    public List<SysMenu> findByPId(String pid) {
        List<SysMenu> menus = this.sysMenuDao.findByPId(pid);
        return menus;
    }

    public SysMenu findById(String id) {
        return this.sysMenuDao.findById(id);
    }

    public SysMenu save(SysMenu sysMenu) {
        return this.sysMenuDao.save(sysMenu);
    }

    public int delete(String id) {
        return this.sysMenuDao.delete(id);
    }

    public SysMenuTable addEntity(SysMenuTable sysMenuTable) {
        return this.sysMenuTableDao.addEntity(sysMenuTable);
    }

    public int deleteEntity(String id) {
        return this.sysMenuTableDao.deleteEntity(id);
    }

    public SysMenuTable findSysMenuTableById(String id) {
        return this.sysMenuTableDao.findSysMenuTableById(id);
    }
}
