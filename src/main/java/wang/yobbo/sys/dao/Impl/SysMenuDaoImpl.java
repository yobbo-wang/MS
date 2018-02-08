package wang.yobbo.sys.dao.Impl;

import com.alibaba.druid.sql.dialect.oracle.ast.stmt.OracleCreateTableStatement;
import org.springframework.stereotype.Component;
import wang.yobbo.common.appengine.BaseDaoManager;
import wang.yobbo.common.appengine.dao.Impl.BaseDaoImpl;
import wang.yobbo.sys.dao.SysMenuDao;
import wang.yobbo.sys.entity.SysMenu;

import java.util.List;

@Component
public class SysMenuDaoImpl extends BaseDaoImpl<SysMenu, String> implements SysMenuDao{
    public List<SysMenu> findByPId(String pid) {
        BaseDaoManager baseDaoManager = super.getBaseDaoManager();
        if (pid != null && pid.length() > 0) {
            String jpql = "select ms_sys_menu from SysMenu ms_sys_menu where ms_sys_menu.parent.id=:pid";
            return (List<SysMenu>) baseDaoManager.getEntityManager().createQuery(jpql)
                    .setParameter("pid", pid).getResultList();
        } else {
            String jpql = "select ms_sys_menu from SysMenu ms_sys_menu where ms_sys_menu.parent is null";
            return (List<SysMenu>) baseDaoManager.getEntityManager().createQuery(jpql).getResultList();
        }
    }
}
