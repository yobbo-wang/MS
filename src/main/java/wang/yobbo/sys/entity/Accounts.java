package wang.yobbo.sys.entity;

import javax.persistence.*;
import java.io.Serializable;

/**
 * Created by xiaoyang on 2017/12/24.
 * 账号管理
 */
@Entity
@Table(name = "bcm_Accounts")
public class Accounts implements Serializable {

    @Id
    @GeneratedValue
    @Column(name = "ID", length = 10)
    private Long id;
    @Column(name = "USERNAME", length = 20, nullable = false, unique = true)
    private String username;
    @Column(name = "ACCOUNT", length = 5, nullable = false)
    private Double account;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Double getAccount() {
        return account;
    }

    public void setAccount(Double account) {
        this.account = account;
    }
}
