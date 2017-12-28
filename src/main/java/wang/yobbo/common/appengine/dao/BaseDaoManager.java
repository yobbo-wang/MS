package wang.yobbo.common.appengine.dao;

import net.sf.ehcache.config.Searchable;
import org.springframework.orm.jpa.SharedEntityManagerCreator;
import org.springframework.util.Assert;
import wang.yobbo.common.appengine.entity.AbstractEntity;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;

/**
 * Created by xiaoyang on 2017/12/28.
 * 数据操作Manager
 * 该类提供一些基础数据操方法
 */
public final class BaseDaoManager {
    private static EntityManager entityManager;
    private Class<?> entityClass;

    public BaseDaoManager(){

    }

    //实例化
    public BaseDaoManager(Class<? extends AbstractEntity> clazz) {

    }

    public static void setEntityManagerFactory(EntityManagerFactory entityManagerFactory) {
        entityManager = SharedEntityManagerCreator.createSharedEntityManager(entityManagerFactory);
    }
    public EntityManager getEntityManager() {
        Assert.notNull(entityManager, "entityManager must null, please see " +
                "[wang.yobbo.common.appengine.dao.BaseDaoManager#setEntityManagerFactory]");
        return entityManager;
    }

    public long count(Searchable searchable) {
        return 0;
    }

}
