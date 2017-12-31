package wang.yobbo.common.appengine;

import net.sf.ehcache.config.Searchable;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.orm.jpa.SharedEntityManagerCreator;
import org.springframework.util.Assert;
import wang.yobbo.common.appengine.dao.Impl.BaseDaoImpl;
import wang.yobbo.common.appengine.entity.AbstractEntity;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import java.util.List;

/**
 * Created by xiaoyang on 2017/12/28.
 * 数据操作Manager
 * 该类提供一些基础数据操方法
 */
public final class BaseDaoManager {
    private static final String COUNT_QUERY_STRING = "select count(x) from %s x where 1=1 ";
    private static final String FIND_QUERY_STRING = "from %s x where 1=1 ";
    private static EntityManager entityManager;
    private JpaEntityInformation jpaEntityInformation;
    private String entityName;
    private String IDName;
    private Class<?> entityClass;
    private String countAllJPQLL;
    private String findAllJPQL;

    public BaseDaoManager(){
    }

    /**
     * 实例化是，假如clazz是BaseDaoImpl，则不给entityClass赋值
     * @param clazz
     */
    public BaseDaoManager(Class<?> clazz) {
        if(!StringUtils.equals(clazz.getName(), BaseDaoImpl.class.getName())){
            this.entityClass = clazz;
            //新版Spring jpa可能把JpaEntityInformationSupport.getEntityInformation替换成JpaEntityInformationSupport.getMetadata了。
            this.jpaEntityInformation = JpaEntityInformationSupport.getMetadata(entityClass, entityManager);
            this.entityName = this.jpaEntityInformation.getEntityName(); //获取实体名称
            this.IDName = (String)this.jpaEntityInformation.getIdAttributeNames().iterator().next(); //获取主键ID名称
            this.countAllJPQLL = String.format(COUNT_QUERY_STRING, this.entityName);
            this.findAllJPQL = String.format(FIND_QUERY_STRING , this.entityName);
        }
        System.out.println(this.entityClass);
        System.out.println(this.entityName);
        System.out.println(this.IDName);
    }

    public static void setEntityManagerFactory(EntityManagerFactory entityManagerFactory) {
        entityManager = SharedEntityManagerCreator.createSharedEntityManager(entityManagerFactory);
    }
    public EntityManager getEntityManager() {
        Assert.notNull(entityManager, "entityManager must not null, please see " +
                "[wang.yobbo.common.appengine.BaseDaoManager#setEntityManagerFactory]");
        return entityManager;
    }

    /**
     * 查询所有结果集
     * @param <T>
     * @return
     */
    public <T>List<T> findAll(){
//        return this.findAll(this.findAllJPQL, new Object[0]);
        return null;
    }

    /**
     * 获取实体结果集
     * @param searchable
     * @return
     */
    public long count(Searchable searchable) {
        return this.count(this.countAllJPQLL, searchable);
    }

    private long count(String nxql, Searchable searchable) {
//        this.assertConverted(searchable);
        StringBuilder s = new StringBuilder(nxql);
//        searchCallback.prepareNXQL(s, searchable);
        Query query = this.getEntityManager().createQuery(s.toString());
//        searchCallback.setValues(query, searchable);
        return ((Long)query.getSingleResult()).longValue();
    }

}
