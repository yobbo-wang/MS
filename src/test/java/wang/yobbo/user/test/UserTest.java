package wang.yobbo.user.test;

import org.apache.shiro.codec.Base64;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import wang.yobbo.sys.dao.UsersDao;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.NoSuchAlgorithmException;
import java.sql.Timestamp;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by xiaoyang on 2017/12/28.
 *
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/spring-root.xml")
public class UserTest {

    public static void main(String[] s) {
        KeyGenerator keygen = null;
        try {
            keygen = KeyGenerator.getInstance("AES");
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        SecretKey deskey = keygen.generateKey();
        System.out.println(Base64.encodeToString(deskey.getEncoded()));
    }

    @Autowired
    UsersDao usersDao;

    @Test
    public void testFindBySql(){
        String sql = " SELECT * FROM `act_re_model` where ID_ = ?1 and CREATE_TIME_ >= ?2 and CREATE_TIME_ <= ?3";
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        try {
            this.usersDao.findBySql(sql, 1, sdf.parse("2017-1-1").getTime(),
                    new Timestamp(System.currentTimeMillis()));
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    @Test
    public void testOne(){
        this.usersDao.findBySql("SELECT * FROM `act_hi_actinst`");
    }

    @Test
    public void findBySqlCount(){
        System.out.println(this.usersDao.findBySqlCount("SELECT * FROM `act_hi_actinst`"));
    }
}
