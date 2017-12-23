package wang.yobbo.sys.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wang.yobbo.sys.dao.UsersDao;

@Service
@Transactional
public class SysService {

    @Autowired
    private UsersDao usersDao;

    public void getInfo(){
        this.usersDao.findOne(1L);
    }
}
