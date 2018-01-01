package wang.yobbo.sys.dao;

import net.sf.ehcache.config.Searchable;
import wang.yobbo.sys.entity.User;

import java.util.List;

public interface UsersDao{

    void findBySql(String sql, Object...params);

    int findBySqlCount(String sql, Object ...params);

    long getCount(Searchable searchable);

    List<User> findUserAll();
}
