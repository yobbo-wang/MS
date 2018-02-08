package wang.yobbo.sys.dao;

import wang.yobbo.sys.entity.SysMenu;

import java.util.List;

public interface SysMenuDao {
    List<SysMenu> findByPId(String pid);
}
