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

    @Column(name = "IP", length = 18, unique = true, nullable = false)
    private String IP;

    @Column(name = "UID", length = 30)
    private String UID;

    @Column(name = "PWD", length = 50)
    private String PWD;

    @Column(name = "NAME", length = 30)
    private String NAME;

    @Column(name = "REMARK", length = 50)
    private String REMARK;

    public String getIP() {
        return IP;
    }

    public void setIP(String IP) {
        this.IP = IP;
    }

    public String getUID() {
        return UID;
    }

    public void setUID(String UID) {
        this.UID = UID;
    }

    public String getPWD() {
        return PWD;
    }

    public void setPWD(String PWD) {
        this.PWD = PWD;
    }

    public String getNAME() {
        return NAME;
    }

    public void setNAME(String NAME) {
        this.NAME = NAME;
    }

    public String getREMARK() {
        return REMARK;
    }

    public void setREMARK(String REMARK) {
        this.REMARK = REMARK;
    }

    public boolean isNew() {
        return false;
    }
}
