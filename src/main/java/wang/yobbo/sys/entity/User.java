package wang.yobbo.sys.entity;

import wang.yobbo.common.appengine.entity.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import java.sql.Timestamp;
import java.util.Date;

/**
 * 实体类可以继承BaseEntity，BaseEntity类已经加了ID、CREATE_DATE、UPDATE_DATE字段，主键生成策略是32位UUID
 * @Cache(usage = CacheConcurrencyStrategy.READ_ONLY) 如果在实体上加了这个注解，只能新增,删除，不能修改
 */
@Entity
@Table(name = "MS_SYS_USERS")
public class User extends BaseEntity<String>{

    @Column(name = "UID", length = 64, nullable = false, unique = true)
    private String loginName;

    @Column(name = "NAME", length = 50, nullable = false)
    private String name;

    @Column(name = "PWD", length = 64, nullable = false)
    private String password;

    public String getLoginName() {
        return loginName;
    }

    public void setLoginName(String loginName) {
        this.loginName = loginName;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public boolean isNew() {
        return false;
    }
}
