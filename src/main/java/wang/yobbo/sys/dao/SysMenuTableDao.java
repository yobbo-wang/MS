package wang.yobbo.sys.dao;

import wang.yobbo.sys.entity.SysMenuTable;

public interface SysMenuTableDao {
    /**
     * 保存或更新菜单实体
     * @param sysMenuTable
     * @return
     */
    SysMenuTable addEntity(SysMenuTable sysMenuTable);

    int deleteEntity(String id);

    SysMenuTable findSysMenuTableById(String id);
}
