package wang.yobbo.sys.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import wang.yobbo.sys.entity.Users;

public interface UsersDao extends JpaRepository<Users, Long> {

}
