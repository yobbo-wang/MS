package wang.yobbo.sys.entity;

import wang.yobbo.common.appengine.entity.BaseEntity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

/**
 * 主机信息
 */
@Entity
@Table(name = "MS_HOSTS")
public class Hosts extends BaseEntity<String> {
    private static final long serialVersionUID = 1L;
    @Column(name = "IP", length = 18, unique = true, nullable = false)
    private String ip;

    @Column(name = "USER_NAME", length = 30, nullable = false)
    private String user_name;

    @Column(name = "PWD", length = 50)
    private String pwd;

    @Column(name = "NAME", length = 30)
    private String name;

    @Column(name = "REMARK", length = 50)
    private String remark;

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

    public String getUser_name() {
        return user_name;
    }

    public void setUser_name(String user_name) {
        this.user_name = user_name;
    }

    public String getPwd() {
        return pwd;
    }

    public void setPwd(String pwd) {
        this.pwd = pwd;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public boolean isNew() {
        return false;
    }
}
