package wang.yobbo.sys.service;

import wang.yobbo.sys.entity.SysMenu;

import java.util.List;

public interface SysMenuService {
    List<SysMenu> findByPId(String pid);
}
