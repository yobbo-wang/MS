package wang.yobbo.common.appengine;

import javax.persistence.EntityManager;

/**
 * Created by xiaoyang on 2017/12/25.
 * 数据库相关封装层
 */
public class BaseDao{
    private static EntityManager entityManager;

    public static void setEntityManagerFactory(EntityManager entityManager) {
        BaseDao.entityManager = entityManager;
    }

    /**
     * 保存实体公共方法
     * @param entity ：实体
     * @param <T> ：实体泛型
     * @return ：返回实体结果
     */
    public <T extends AbstractEntity> T save(T entity){
        if(null == entity)
            return null;
        if(null == entity.getId()){
            this.entityManager.persist(entity);
        }else{
            entity = this.entityManager.merge(entity);
        }
        return entity;
    }

}
