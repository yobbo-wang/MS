package wang.yobbo.common.appengine.dao.Impl;

import net.sf.ehcache.config.Searchable;
import org.hibernate.transform.Transformers;
import org.springframework.data.domain.Page;
import org.springframework.util.Assert;
import wang.yobbo.common.appengine.BaseDaoManager;
import wang.yobbo.common.appengine.dao.BaseDao;

import javax.persistence.Query;
import javax.persistence.TemporalType;
import java.io.Serializable;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.sql.Time;
import java.sql.Timestamp;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by xiaoyang on 2017/12/28.
 * 数据操作公共类
 * 如果父类没有指定是哪个实体对象，那DaoImpl里只能查询自定义sql。不能操作实体对象
 */
public class BaseDaoImpl<E, ID extends Serializable> implements BaseDao<E, ID>{
    private BaseDaoManager baseDaoManager;

    private BaseDaoManager getBaseDaoManager(){
        if(null == this.baseDaoManager) {
            this.baseDaoManager = new BaseDaoManager(this.getClassForStatic());
        }
        return this.baseDaoManager;
    }

    /**
     * 如果没有指定超类，默认Entity是当前BaseDaoImpl。这样只能查询自定义sql
     * @return
     */
    private Class<E> getClassForStatic() {
        Type type = this.getClass().getGenericSuperclass();
        if(type instanceof ParameterizedType){
            ParameterizedType parameterizedType= (ParameterizedType) type;
            Type[] actualTypeArguments = parameterizedType.getActualTypeArguments();
            return (Class<E>)actualTypeArguments[0];
        }else{
            return (Class<E>) type;
        }
    }


    public Long count(Searchable v0) {
        return this.count(v0);
    }

    public long count() {
        return 0;
    }

    public Page<E> find(Searchable v0) {
        return null;
    }

    public List<E> findPageWithoutCount(Searchable v0) {
        return null;
    }

    public Page<E> find(Searchable var0, E var1) {
        return null;
    }

    public List<E> findAll() {
        return this.getBaseDaoManager().findAll();
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

    /**
     * 根据自定义sql更新
     * @param sql 自定义sql
     * @param var0 参数数组
     * @return 返回影响行数
     */
    public int updateBysql(String sql, Object ...var0){
        Assert.notNull(sql, "sql must not null.");
        Query query = this.getBaseDaoManager().getEntityManager().createNativeQuery(sql);
        baseDaoManager.setParameter(query, var0);
        return query.executeUpdate();
    }

    /**
     * 自定义sql查询记录数
     * @param sql 自定义sql
     * @param var0 参数数组
     * @return 记录数
     */
    public int findBySqlCount(String sql, Object ...var0){
        Assert.notNull(sql, "sql must not null.");
        sql = "select count(1) as COUNT from ( " + sql + ") a";
        Query query = this.getBaseDaoManager().getEntityManager().createNativeQuery(sql);
        query.unwrap(org.hibernate.SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP); //查询结果返回MAP
        baseDaoManager.setParameter(query, var0);
        Map map = (Map)query.getSingleResult();
        return map != null ? Integer.valueOf(map.get("COUNT").toString()): 0;
    }

    /**
     * 自定义sql查询多个结果集。
     * @param sql 自定义sql
     * @param var0 参数数组
     * @return 返回List<Map>结果集
     */
    public List<Map> fingBySqlList(String sql, Object ...var0){
        Assert.notNull(sql, "sql must not null.");
        Query query = this.getBaseDaoManager().getEntityManager().createNativeQuery(sql);
        query.unwrap(org.hibernate.SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP); //查询结果返回MAP
        baseDaoManager.setParameter(query, var0);
        return query.getResultList();
    }

    /**
     * 自定义sql查询单条记录。工具不保证单条记录，如果查询到多条会抛出result returns more than one elements错误
     * @param sql 自定义sql
     * @param var0 参数数组
     * @return 返回Map结果集
     */
    public Map findBySqlOne(String sql, Object... var0) {
        Assert.notNull(sql, "sql must not null.");
        Query query = this.getBaseDaoManager().getEntityManager().createNativeQuery(sql);
        query.unwrap(org.hibernate.SQLQuery.class).setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP); //查询结果返回MAP
        baseDaoManager.setParameter(query, var0);
        Object row = query.getSingleResult();
        return (Map)row;
    }

}
