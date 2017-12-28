package wang.yobbo.sys.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wang.yobbo.sys.dao.UsersDao;

@Service
public class SysService{

    @Autowired
    private UsersDao usersDao;

    public void getInfo(){

    }

    /*//只要是方法除去查询的关键字开头的外，都是开启事务，直到方法执行完毕
    public void updateInfo(Accounts a1, Accounts a2){
        this.accountsService.updateOutMenoy(a1);
        int s = 1 / 0;
        this.accountsService.updateInMenoy(a2);
    }*/
}
