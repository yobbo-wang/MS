package wang.yobbo.sys.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import wang.yobbo.sys.entity.Users;

public interface UsersDao extends JpaRepository<Users, Long>, CrudRepository<Users, Long> {

//    Users findUserNameAndPwd(String username, String pwd);
}
