//package wang.yobbo.user.test;
//
//import net.sf.ehcache.config.Searchable;
//import org.apache.shiro.codec.Base64;
//import org.junit.Test;
//import org.junit.runner.RunWith;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.test.context.ContextConfiguration;
//import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
//import wang.yobbo.sys.entity.User;
//import wang.yobbo.sys.service.SysService;
//
//import javax.crypto.KeyGenerator;
//import javax.crypto.SecretKey;
//import java.security.NoSuchAlgorithmException;
//import java.sql.Timestamp;
//import java.text.ParseException;
//import java.text.SimpleDateFormat;
//import java.util.List;
//
///**
// * Created by xiaoyang on 2017/12/28.
// *
// */
//@RunWith(SpringJUnit4ClassRunner.class)
//@ContextConfiguration("classpath:spring/spring-root.xml")
//public class UserTest {
//
//    public static void main(String[] s) {
//        KeyGenerator keygen = null;
//        try {
//            keygen = KeyGenerator.getInstance("AES");
//        } catch (NoSuchAlgorithmException e) {
//            e.printStackTrace();
//        }
//        SecretKey deskey = keygen.generateKey();
//        System.out.println(Base64.encodeToString(deskey.getEncoded()));
//    }
//
//    @Autowired
//    private SysService sysService;
//
////    @Test
//    public void testFindBySql(){
//        String sql = " SELECT * FROM act_re_model where ID_ = ?1 and CREATE_TIME_ >= ?2 and CREATE_TIME_ <= ?3";
//        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//        try {
//            this.sysService.findBySqlOne(sql, 1, sdf.parse("2017-1-1").getTime(),
//                    new Timestamp(System.currentTimeMillis()));
//        } catch (ParseException e) {
//            e.printStackTrace();
//        }
//    }
//
////    @Test
//    public void testOne(){
//        System.out.println(this.sysService.findBySqlOne("SELECT * FROM bcm_sys_users"));
//    }
//
////    @Test
//    public void findBySqlCount(){
//        System.out.println(this.sysService.findBySqlCount("SELECT * FROM act_hi_actinst"));
//    }
//
////    @Test
//    public void findAll(){
//        List<User> all = this.sysService.findUserAll();
//        for (User user : all){
//            System.out.println(user.getName());
//        }
//    }
//
////    @Test
//    public void getCount(){
//        Searchable searchable = new Searchable();
////        searchable.addSearchAttribute(");
//        long count = this.sysService.getCount(searchable);
//        System.out.println(count);
//    }
//
////    @Test
//    public void delete(){
//        int count = this.sysService.deleteByPrimaryKeys("2c9f8c0b61419751016141975d0e0000", "2c9f8c0b6141846b0161418474c50000");
//        System.out.println(count);
//    }
//
////    @Test
//    public void deleteByEntity(){
//        User user = new User();
//        user.setId("2c9f8c0b614183c201614183cbfe0000");
//        this.sysService.deleteForSysUser(user);
//    }
//
////    @Test
//    public void update(){
////        User user = new User();
////        user.setId("2c9f8c0b614183c201614183cbfe0000");
////        user.setUsername("xioayang2");
////        user.setName("121笑傲1212");
////        user.setPwd("111111");
////        User update = this.sysService.update(user);
//
//    }
//
////    @Test
//    public void save(){
////        User user = new User();
////        user.setUsername("xioayang12121");
////        user.setName("笑傲");
////        user.setPwd("12321321");
////        User save = this.sysService.save(user);
//
//    }
//}
