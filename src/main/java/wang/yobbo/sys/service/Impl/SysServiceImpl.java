package wang.yobbo.sys.service.Impl;

import net.sf.ehcache.config.Searchable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wang.yobbo.sys.dao.UsersDao;
import wang.yobbo.sys.entity.User;
import wang.yobbo.sys.service.SysService;

import java.util.List;
import java.util.Map;

@Service
public class SysServiceImpl implements SysService{
    @Autowired
    private UsersDao usersDao;

    public Map findBySqlOne(String sql, Object... params) {
        return this.usersDao.findBySqlOne(sql, params);
    }

    public int findBySqlCount(String sql, Object... params) {
        return this.usersDao.findBySqlCount(sql, params);
    }

    public long getCount(Searchable searchable) {
        return this.usersDao.getCount(searchable);
    }

    public List<User> findUserAll() {
        return this.usersDao.findUserAll();
    }

    public List<User> findUserAll(User user) {
        return this.usersDao.findUserAll(user);
    }

    public int deleteByPrimaryKeys(String... primaryKey) {
        return this.usersDao.deleteByPrimaryKeys(primaryKey);
    }

    public void deleteForSysUser(User user) {
        this.usersDao.deleteForSysUser(user);
    }

    public User update(User user) {
        return this.usersDao.updateUser(user);
    }

    public User save(User user) {
        return this.usersDao.save(user);
    }
}
