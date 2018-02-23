package wang.yobbo.sys.service;

import wang.yobbo.sys.entity.SysMenu;
import wang.yobbo.sys.entity.SysMenuTable;

import java.util.List;

public interface SysMenuService {
    List<SysMenu> findByPId(String pid);

    SysMenu findById(String id);

    SysMenu save(SysMenu sysMenu);

    int delete(String id);

    SysMenuTable addEntity(SysMenuTable sysMenuTable);

    int deleteEntity(String id);

    SysMenuTable findSysMenuTableById(String id);
}
