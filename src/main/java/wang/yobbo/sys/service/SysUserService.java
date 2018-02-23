package wang.yobbo.sys.service;

import net.sf.ehcache.config.Searchable;
import wang.yobbo.sys.entity.SysUser;

import java.util.List;
import java.util.Map;

public interface SysUserService{
    /**
     * 根据自定义sql查询数据结果集
     * @param sql 自定sql
     * @param params 参数数组
     */
    Map findBySqlOne(String sql, Object...params);

    /**
     * 根据自定义sql查询数据结果集记录数
     * @param sql 自定sql
     * @param params 参数数组
     */
    int findBySqlCount(String sql, Object ...params);

    /**
     * 获取结果集个数
     * @param searchable
     * @return
     */
    long getCount(Searchable searchable);

    /**
     * 获取所有实体所有结果集
     * @return
     */
    List<SysUser> findUserAll();

    /**
     * 根据实体值，获取所有结果集
     * @param SysUser
     * @return
     */
    List<SysUser> findUserAll(SysUser SysUser);

    /**
     * 根据主键ID批量删除
     * @param primaryKey
     * @return
     */
    int deleteByPrimaryKeys(String ... primaryKey);

    void deleteForUser(SysUser SysUser);

    SysUser update(SysUser SysUser);

    SysUser save(SysUser SysUser);
}
