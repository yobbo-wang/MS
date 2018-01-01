package wang.yobbo.sys.dao.Impl;

import net.sf.ehcache.config.Searchable;
import org.springframework.stereotype.Service;
import wang.yobbo.common.appengine.dao.Impl.BaseDaoImpl;
import wang.yobbo.sys.dao.UsersDao;
import wang.yobbo.sys.entity.User;

import java.util.List;

/**
 * Created by xiaoyang on 2017/12/28.
 *
 */
@Service
public class UsersDaoImpl extends BaseDaoImpl<User, String> implements UsersDao{

    public void findBySql(String sql, Object...params) {
        System.out.println(super.findBySqlOne(sql, params));
    }

    @Override
    public int findBySqlCount(String sql, Object... params) {
        return super.findBySqlCount(sql, params);
    }

    public long getCount(Searchable searchable) {
        return 0;
    }

    public List<User> findUserAll() {
        return super.findAll();
    }

}
