package wang.yobbo.sys.entity;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import wang.yobbo.common.appengine.entity.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 实体类可以继承BaseEntity，BaseEntity类已经加了ID、CREATE_DATE、UPDATE_DATE字段，主键生成策略是32位UUID
 * @Cache(usage = CacheConcurrencyStrategy.READ_ONLY) 如果在实体上加了这个注解，只能新增,删除，不能修改
 */
@Entity
@Table(name = "MS_SYS_USERS")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class SysUser extends BaseEntity<String>{
    private static final long serialVersionUID = 1L;

    @Column(name = "USER_NAME", length = 64, nullable = false, unique = true)
    private String user_name;

    @Column(name = "NAME", length = 50, nullable = false)
    private String name;

    @Column(name = "PWD", length = 64, nullable = false)
    private String pwd;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isNew() {
        return false;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }
}
