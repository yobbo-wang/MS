package wang.yobbo.sys.entity;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import wang.yobbo.common.appengine.entity.BaseEntity;

import javax.persistence.*;
import java.io.Serializable;

/**
 * 实体类可以继承BaseEntity，BaseEntity类已经加了ID、CREATE_DATE、UPDATE_DATE字段，主键生成策略是32位UUID
 */
@Entity
@Table(name = "bcm_sys_users")
@Cache(usage = CacheConcurrencyStrategy.READ_ONLY)
public class User extends BaseEntity<String> implements Serializable{

    /*@Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "ID", length = 20)
    private Long id;*/

    @Column(name = "USER_NAME", length = 100, nullable = false, unique = true)
    private String username;

    @Column(name = "NAME", length = 50, nullable = false)
    private String name;

    @Column(name = "pwd", length = 60, nullable = false)
    private String pwd;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public boolean isNew() {
        return false;
    }

    /*public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }*/
}
