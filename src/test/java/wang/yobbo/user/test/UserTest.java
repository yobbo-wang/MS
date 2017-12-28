package wang.yobbo.user.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import wang.yobbo.sys.dao.UsersDao;

/**
 * Created by xiaoyang on 2017/12/28.
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/spring-root.xml")
public class UserTest {
    @Autowired
    UsersDao usersDao;

    @Test
    public void testFindBySql(){
        this.usersDao.findBySql("");
    }
}
