package wang.yobbo.sys.dao.Impl;

import org.springframework.stereotype.Component;
import wang.yobbo.common.appengine.BaseDaoManager;
import wang.yobbo.common.appengine.dao.Impl.BaseDaoImpl;
import wang.yobbo.sys.dao.SysMenuDao;
import wang.yobbo.sys.entity.SysMenu;

import javax.persistence.Query;
import java.util.List;

@Component
public class SysMenuDaoImpl extends BaseDaoImpl<SysMenu, String> implements SysMenuDao{
    public List<SysMenu> findByPId(String pid) {
        BaseDaoManager baseDaoManager = super.getBaseDaoManager();
        String msql = (pid != null && pid.length() > 0) ?
                "select ms_sys_menu from SysMenu ms_sys_menu where ms_sys_menu.parent_id=:pid" :
                "select ms_sys_menu from SysMenu ms_sys_menu where ms_sys_menu.parent_id is null";
        Query query = baseDaoManager.getEntityManager().createQuery(msql);
        if((pid != null && pid.length() > 0)){
            query.setParameter("pid", pid);
        }
        List<SysMenu> list = query.getResultList();
        return list;
    }

    public SysMenu findById(String id) {
        return super.get(id);
    }

    public SysMenu save(SysMenu sysMenu) {
        return super.saveOfEntity(sysMenu);
    }

    public int delete(String id) {
        return super.deleteById(id);
    }
}
