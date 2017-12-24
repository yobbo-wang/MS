package wang.yobbo.sys.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import wang.yobbo.sys.entity.Accounts;

/**
 * Created by xiaoyang on 2017/12/24.
 *
 */
public interface AccountsDao extends JpaRepository<Accounts, Long>, CrudRepository<Accounts, Long> {

}
