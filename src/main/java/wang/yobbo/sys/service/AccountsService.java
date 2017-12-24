package wang.yobbo.sys.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wang.yobbo.sys.dao.AccountsDao;
import wang.yobbo.sys.entity.Accounts;

import java.util.List;

/**
 * Created by xiaoyang on 2017/12/24.
 */
@Service
public class AccountsService {
    @Autowired
    private AccountsDao accountsDao;

    public void save(List<Accounts> accountsList){
        this.accountsDao.save(accountsList);
    }

    public void updateOutMenoy(Accounts accounts){
        this.accountsDao.save(accounts);
    }

    public void updateInMenoy(Accounts accounts){
        this.accountsDao.save(accounts);
    }

}
