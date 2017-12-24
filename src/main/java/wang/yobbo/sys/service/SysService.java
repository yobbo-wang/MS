package wang.yobbo.sys.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import wang.yobbo.sys.dao.UsersDao;
import wang.yobbo.sys.entity.Accounts;

@Service
@Transactional
public class SysService {

    @Autowired
    private UsersDao usersDao;

    @Autowired
    private  AccountsService accountsService;

    public void getInfo(){
        this.usersDao.findOne(1L);
    }

    //只要是方法除去查询的关键字开头的外，都是开启事务，直到方法执行完毕
    public void updateInfo(Accounts a1, Accounts a2){
        this.accountsService.updateOutMenoy(a1);
        int s = 1 / 0;
        this.accountsService.updateInMenoy(a2);
    }

}
