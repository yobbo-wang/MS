package wang.yobbo.common.appengine;

import net.sf.ehcache.config.Searchable;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.support.JpaEntityInformation;
import org.springframework.data.jpa.repository.support.JpaEntityInformationSupport;
import org.springframework.orm.jpa.SharedEntityManagerCreator;
import org.springframework.util.Assert;
import wang.yobbo.common.appengine.dao.Impl.BaseDaoImpl;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Query;
import javax.persistence.TemporalType;
import java.util.Calendar;
import java.util.Date;
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
     * @param <T> 实体
     * @return 结果集
     */
    public <T>List<T> findAll(){
        Assert.notNull(this.entityClass, "Entity must not null, please set Entity.");
        return this.findAll(this.findAllJPQL, new Object[0]);
    }

    private <T> List<T> findAll(String hql, Object... params) {
        return this.findAll(hql, (Pageable)null, params);
    }

    private  <T> List<T> findAll(String hql, Pageable pageable, Object... params) {
        Query query = this.getEntityManager().createQuery(hql + this.prepareOrder(pageable != null ? pageable.getSort() : null));
        this.setParameter(query, params);
        if(pageable != null) {
            query.setFirstResult(pageable.getOffset());
            query.setMaxResults(pageable.getPageSize());
        }
        return query.getResultList();
    }

    private String prepareOrder(Sort sort) {
        if(sort != null && sort.iterator().hasNext()) {
            StringBuilder orderBy = new StringBuilder("");
            orderBy.append(" order by ");
            orderBy.append(sort.toString().replace(":", " "));
            return orderBy.toString();
        } else {
            return "";
        }
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
        return (Long) query.getSingleResult();
    }

    /**
     * 设置sql参数公共处理方法
     * @param query
     * @param var0
     */
    public void setParameter(Query query, Object ... var0){
        if(query.getParameters().size() != var0.length) {
            throw new RuntimeException("参数个数与设值个数不相等。");
        }
        for(int i=0;i<var0.length;i++){
            int index = i + 1;
            Object param = var0[i];
            if(param instanceof Date){
                query.setParameter(index, (Date) param, TemporalType.DATE); //转换成日期格式Date.from(Instant.parse(param.toString()))
            }
            else if(param instanceof Calendar){
                query.setParameter(index, (Calendar)param, TemporalType.DATE);
            }
            else{
                query.setParameter(index, param);
            }
        }
    }

}
