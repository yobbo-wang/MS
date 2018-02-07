package wang.yobbo.sys.dao.Impl;

import net.sf.ehcache.config.Searchable;
import org.springframework.stereotype.Service;
import wang.yobbo.common.appengine.dao.Impl.BaseDaoImpl;
import wang.yobbo.sys.dao.UsersDao;
import wang.yobbo.sys.entity.User;

import java.util.List;
import java.util.Map;

/**
 * Created by xiaoyang on 2017/12/28.
 *
 */
@Service
public class UsersDaoImpl extends BaseDaoImpl<User, String> implements UsersDao{

    public Map<String, Object> findBySqlOne(String sql, Object...params) {
        return super.findBySqlOne(sql, params);
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

    public List<User> findUserAll(User user){
        return super.findAll(user);
    }

    public int deleteByPrimaryKeys(String... primaryKey) {
        return super.deleteById(primaryKey);
    }

    public void deleteForSysUser(User user) {
        super.deleteOfEntity(user);
    }

    public User updateUser(User user) {
        return super.updateOfEntity(user);
    }

    public User save(User user){
        return super.saveOfEntity(user);
    }
}
