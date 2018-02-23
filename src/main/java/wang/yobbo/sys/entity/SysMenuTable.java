package wang.yobbo.sys.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import wang.yobbo.common.appengine.entity.BaseEntity;

import javax.persistence.*;

/**
 * 菜单表信息
 */
@Entity
@Table(name = "MS_SYS_MENU_TABLES")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE) //读写
public class SysMenuTable extends BaseEntity<String> {
    private static final long serialVersionUID = 1L;

    @Column(name = "TABLE_NAME", length = 40, unique = true)
    private String table_name;

    @Column(name = "REMARK", length = 50)
    private String remark;

    private String menu_id;

    /*@ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "MENU_ID")
    @JsonIgnore
    private SysMenu sysMenu;*/

    public boolean isNew() {
        return false;
    }

    public String getTable_name() {
        return table_name;
    }

    public void setTable_name(String table_name) {
        this.table_name = table_name;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getMenu_id() {
        return menu_id;
    }

    public void setMenu_id(String menu_id) {
        this.menu_id = menu_id;
    }
}
