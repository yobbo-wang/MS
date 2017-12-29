package wang.yobbo.common.appengine.dao.Impl;

import net.sf.ehcache.config.Searchable;
import org.hibernate.transform.Transformers;
import org.springframework.data.domain.Page;
import wang.yobbo.common.appengine.dao.BaseDao;
import wang.yobbo.common.appengine.BaseDaoManager;
import wang.yobbo.common.appengine.entity.AbstractEntity;

import javax.persistence.Query;
import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.List;
import java.util.Map;

/**
 * Created by xiaoyang on 2017/12/28.
 * 数据操作公共抽象类
 */
public class BaseDaoImpl<E extends AbstractEntity, ID extends Serializable> implements BaseDao<E, ID>{
    private BaseDaoManager baseDaoManager;

    private BaseDaoManager getBaseDaoManager(){
        if(null == this.baseDaoManager) {
            this.baseDaoManager = new BaseDaoManager(this.getClassForStatic());
        }
        return this.baseDaoManager;
    }

    private Class<E> getClassForStatic() {
        Type type = this.getClass().getGenericSuperclass();
        Type[] generics = ((ParameterizedType)type).getActualTypeArguments();
        return (Class)generics[1];
    }


    public Long count(Searchable v0) {
        return null;
    }

    public long count() {
        return 0;
    }

    public Page<E> find(Searchable v0) {
        return null;
    }

    public List<E> fingPageWithoutCount(Searchable v0) {
        return null;
    }

    public Page<E> find(Searchable var0, E var1) {
        return null;
    }

    public List<E> findAll() {
        return null;
    }

    public List<E> findAll(E var0) {
        return null;
    }

    public E create(E var0) {
        return null;
    }

    public E save(E var0) {
        return null;
    }

    public E update(E var0) {
        return null;
    }

    public int delete(ID[] var0) {
        return 0;
    }

    public E get(Serializable var0) {
        return null;
    }

    public E get(Serializable var0, E var1) {
        return null;
    }

    public E toDTO(E var0) {
        return null;
    }

    public E toEntity(E var0) {
        return null;
    }

    //原生sql支持

    /**
     * public List findById (int id) {
     String sql = "select u.*,c.* from user u,commont c where u.id = c.id and id=?1";
     Query query = entityManager.createNativeQuery(sql);
     query.setParameter(1,id);
     //转换为Map集合
     query.unwrap(org.hibernate.SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
     return query.getResultList();
     }
     * @param sql
     * @param var0
     * @return
     */
    public Map findBySqlOne(String sql, Object... var0) {
        Query query = this.getBaseDaoManager().getEntityManager().createNativeQuery(sql);
        query.unwrap(org.hibernate.SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP); //查询结果返回MAP
        List rows = query.getResultList();
//        System.out.println(rows.get(0).getClass().getName());
//        System.out.println(rows.get(0).getClass().getFields().length);
        return (Map)rows.get(0);
    }
}
