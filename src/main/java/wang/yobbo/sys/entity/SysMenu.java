package wang.yobbo.sys.entity;

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
    private String text;

    @Column(name = "URL", length = 32)
    private String url;

    @Column(name = "TYPE", length = 32)
    private String type;

    @Column(name = "REMARK", length = 50)
    private String remark;

    @Column(name = "ORDER_NUMBER", length = 10)
    private Integer order_number;

    private String parent_id;

    //下级菜单
    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "PARENT_ID", insertable = false, updatable = false)
    private List<SysMenu> children = new ArrayList<SysMenu>();

    @OneToMany(fetch = FetchType.EAGER, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "MENU_ID")
    private List<SysMenuTable> tables = new ArrayList<SysMenuTable>();

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getParent_id() {
        return parent_id;
    }

    public void setParent_id(String parent_id) {
        this.parent_id = parent_id;
    }

    public List<SysMenu> getChildren() {
        return children;
    }

    public void setChildren(List<SysMenu> children) {
        this.children = children;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public Integer getOrder_number() {
        return order_number;
    }

    public void setOrder_number(Integer order_number) {
        this.order_number = order_number;
    }

    public List<SysMenuTable> getTables() {
        return tables;
    }

    public void setTables(List<SysMenuTable> tables) {
        this.tables = tables;
    }

    public boolean isNew() {
        //TODO 待实现
        return false;
    }
}
