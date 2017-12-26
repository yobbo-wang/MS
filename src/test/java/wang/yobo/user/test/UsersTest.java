package wang.yobo.user.test;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import wang.yobbo.sys.dao.UsersDao;
import wang.yobbo.sys.entity.Users;
import wang.yobbo.sys.service.SysService;

import java.util.ArrayList;
import java.util.List;

@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration(locations = {"classpath:spring/spring-persistence.xml"})
public class UsersTest {

    @Autowired
    private SysService sysService;

    @Autowired
    private UsersDao usersDao;

    public void saveBase(){

    }

    //测试二级缓存是否生效
    @Test
    public void findOne(){
        Users user = this.usersDao.findOne(1L);
        System.out.print("姓名：" + user.getName() );
        System.out.print("登录名: " + user.getUsername());
        System.out.print("密码: " + user.getPwd());
        System.out.println();

        Users us = this.usersDao.findOne(1L);
        System.out.print("姓名：" + us.getName() );
        System.out.print("登录名: " + us.getUsername());
        System.out.print("密码: " + us.getPwd());
        System.out.println();
    }

    //TODO 对比测试查询数据库效率(与myBatis)
    @Test
    public void findByUsernameAndPwd(){
        for (Users user : this.usersDao.findAll()) {
            System.out.print("姓名：" + user.getName() );
            System.out.print("登录名: " + user.getUsername());
            System.out.print("密码: " + user.getPwd());
        }
        this.usersDao.findAll();
    }

//    @Test
    public void test(){
        Users user = new Users();
        user.setId(1L);
        user.setName("xioayang");
        user.setUsername("yangyang");
        user.setPwd("111111");
        this.usersDao.save(user);
        for (Users users : this.usersDao.findAll()) {
            System.out.println("name: " + users.getName());
        }
        System.out.println("56789");
    }

//    @Test
    public void saveMOre(){
        List<Users> users = new ArrayList<Users>();
        for(int i=1;i<=1000000;i++) {
            Users user = new Users();
            user.setName("小羊" + i);
            user.setPwd("111111");
            user.setUsername("xiaoyang" + i);
            users.add(user);
        }
        this.usersDao.save(users);

    }

}
