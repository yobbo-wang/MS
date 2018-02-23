package wang.yobbo.sys.service.Impl;

import net.sf.ehcache.config.Searchable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wang.yobbo.sys.dao.SysUsersDao;
import wang.yobbo.sys.entity.SysUser;
import wang.yobbo.sys.service.SysUserService;

import java.util.List;
import java.util.Map;

@Service
public class SysUserServiceImpl implements SysUserService {
    @Autowired
    private SysUsersDao usersDao;

    public Map findBySqlOne(String sql, Object... params) {
        return this.usersDao.findBySqlOne(sql, params);
    }

    public int findBySqlCount(String sql, Object... params) {
        return this.usersDao.findBySqlCount(sql, params);
    }

    public long getCount(Searchable searchable) {
        return this.usersDao.getCount(searchable);
    }

    public List<SysUser> findUserAll() {
        return this.usersDao.findUserAll();
    }

    public List<SysUser> findUserAll(SysUser user) {
        return this.usersDao.findUserAll(user);
    }

    public int deleteByPrimaryKeys(String... primaryKey) {
        return this.usersDao.deleteByPrimaryKeys(primaryKey);
    }

    public void deleteForUser(SysUser SysUser) {

    }

    public SysUser update(SysUser user) {
        return this.usersDao.updateUser(user);
    }

    public SysUser save(SysUser user) {
        return this.usersDao.save(user);
    }
}
