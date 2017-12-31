package wang.yobbo.sys.dao;

import net.sf.ehcache.config.Searchable;

public interface UsersDao {

    void findBySql(String sql, Object...params);

    int findBySqlCount(String sql, Object ...params);

    long getCount(Searchable searchable);
}
