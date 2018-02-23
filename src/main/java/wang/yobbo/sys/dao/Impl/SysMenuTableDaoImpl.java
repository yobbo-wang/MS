package wang.yobbo.sys.dao.Impl;

import org.springframework.stereotype.Component;
import wang.yobbo.common.appengine.dao.Impl.BaseDaoImpl;
import wang.yobbo.sys.dao.SysMenuTableDao;
import wang.yobbo.sys.entity.SysMenuTable;

@Component
public class SysMenuTableDaoImpl extends BaseDaoImpl<SysMenuTable, String> implements SysMenuTableDao {

    public SysMenuTable addEntity(SysMenuTable sysMenuTable) {
        return super.saveOfEntity(sysMenuTable);
    }

    public int deleteEntity(String id) {
        return super.deleteById(id);
    }

    public SysMenuTable findSysMenuTableById(String id) {
        return super.get(id);
    }
}
