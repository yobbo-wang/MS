package wang.yobbo.sys.dao;

import wang.yobbo.sys.entity.SysMenu;
import wang.yobbo.sys.entity.SysMenuTable;

import java.util.List;

public interface SysMenuDao {
    List<SysMenu> findByPId(String pid);

    SysMenu findById(String id);

    SysMenu save(SysMenu sysMenu);

    int delete(String id);
}
