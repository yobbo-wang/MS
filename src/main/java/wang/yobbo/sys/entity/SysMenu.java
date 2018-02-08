package wang.yobbo.sys.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import wang.yobbo.common.appengine.entity.BaseEntity;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * 菜单配置
 */
@Entity
@Table(name = "MS_SYS_MENU")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE) //读写
public class SysMenu extends BaseEntity<String> {
    private static final long serialVersionUID = 1L;

    /**
     * 菜单名称
     */
    @Column(name = "NAME", length = 30)
    private String NAME;

    @Column(name = "URL", length = 32)
    private String URL;

    @Column(name = "TYPE", length = 32)
    private String TYPE;

    /**
     * 上级菜单ID，用于映射解析
     */
    @Column(insertable = false, updatable = false)
    private String PID;

    /**
     * 上级菜单ID
     */
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "PID")
    @JsonIgnore //忽略该字段，不让JSON序列化
    private SysMenu parent;

    /**
     * 下级菜单
     */
    @OneToMany(mappedBy = "parent", fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    private List<SysMenu> children = new ArrayList<SysMenu>();

    public String getNAME() {
        return NAME;
    }

    public void setNAME(String NAME) {
        this.NAME = NAME;
    }

    public SysMenu getParent() {
        return parent;
    }

    public void setParent(SysMenu parent) {
        this.parent = parent;
    }

    public String getURL() {
        return URL;
    }

    public void setURL(String URL) {
        this.URL = URL;
    }

    public String getTYPE() {
        return TYPE;
    }

    public void setTYPE(String TYPE) {
        this.TYPE = TYPE;
    }

    public boolean isNew() {
        return false;
    }

    public List<SysMenu> getChildren() {
        return children;
    }

    public void setChildren(List<SysMenu> children) {
        this.children = children;
    }

    public String getPID() {
        return PID;
    }

    public void setPID(String PID) {
        this.PID = PID;
    }
}
