package wang.yobo.user.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import wang.yobbo.sys.entity.Accounts;
import wang.yobbo.sys.service.AccountsService;
import wang.yobbo.sys.service.SysService;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by xiaoyang on 2017/12/24.
 */
@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(locations = {"classpath:spring/spring-root.xml"})
public class AccountsTest {

    @Autowired
    private AccountsService accountsService;

    @Autowired
    private SysService sysService;

//    @Test
    public void save(){
        List<Accounts> accountsList = new ArrayList<Accounts>();
        for(int i=1;i<=3;i++){
            Accounts accounts = new Accounts();
            accounts.setUsername("yangyang" + i);
            accounts.setAccount(1000.00);
            accountsList.add(accounts);
        }
        this.accountsService.save(accountsList);
    }

    @Test
    public void update(){
        Accounts accounts1 = new Accounts();
        accounts1.setId(1L);
        accounts1.setUsername("yangyang1");
        accounts1.setAccount(800.00);

        Accounts accounts2 = new Accounts();
        accounts2.setId(2L);
        accounts2.setUsername("yangyang2");
        accounts2.setAccount(1200.00);

        this.sysService.updateInfo(accounts1, accounts2);
    }
}
