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
@Table(name = "BCM_SYS_USERS")
public class User extends BaseEntity<String>{

    @Column(name = "EMP_CODE", length = 200)
    private String empCode;

    @Column(name = "CODE", length = 64, nullable = false)
    private String code;

    @Column(name = "LOGIN_NAME", length = 64, nullable = false)
    private String loginName;

    @Column(name = "NAME", length = 50, nullable = false)
    private String name;

    @Column(name = "PASSWORD", length = 64, nullable = false)
    private String password;

    @Column(name = "SEX", length = 10, nullable = false)
    private String sex;

    @Column(name = "PHONE_NUM_TWO", length = 11)
    private String phoneNumTwo;

    @Column(name = "PHONE_NUM_ONE", length = 11)
    private String phoneNumOne;

    @Column(name = "PRESSING", length = 11)
    private String pressing;

    @Column(name = "PRESSING_PHONE", length = 11)
    private String pressingPhone;

    @Column(name = "EMAIL", length = 11)
    private String email;

    @Column(name = "ADDRESS", length = 250)
    private String address;

    @Column(name = "ENTRY_DATE")
    private Date entryDate;

    @Column(name = "ORG_ID", length = 32)
    private String orgId;

    @Column(name = "DEP_ID", length = 32)
    private String depId;

    @Column(name = "POST_ID", length = 32)
    private String postId;

    @Column(name = "SOURCE", length = 30)
    private String source;

    @Column(name = "STATE", length = 2)
    private String state;

    @Column(name = "LAST_DATE")
    private Timestamp lastDate;

    @Column(name = "REMARK", length = 400)
    private String remark;

    @Column(name = "CREATE_USER", length = 200)
    private String createUser;

    @Column(name = "UPDATE_USER", length = 200)
    private String updateUser;

    @Column(name = "DEVICE", length = 400)
    private String device;

    @Column(name = "UPDATE_STATE", length = 11)
    private int updateState;

    @Column(name = "BUSINESS_TYPE_ID", length = 400)
    private String businessTypeId;

    @Column(name = "BUSINESS_TYPE_NAME", length = 400)
    private String businessTypeName;

    @Column(name = "TORG_ID", length = 32)
    private String torgId;

    @Column(name = "TORG_IDS", length = 400)
    private String torgIds;

    public String getEmpCode() {
        return empCode;
    }

    public void setEmpCode(String empCode) {
        this.empCode = empCode;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

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

    public String getSex() {
        return sex;
    }

    public void setSex(String sex) {
        this.sex = sex;
    }

    public String getPhoneNumTwo() {
        return phoneNumTwo;
    }

    public void setPhoneNumTwo(String phoneNumTwo) {
        this.phoneNumTwo = phoneNumTwo;
    }

    public String getPhoneNumOne() {
        return phoneNumOne;
    }

    public void setPhoneNumOne(String phoneNumOne) {
        this.phoneNumOne = phoneNumOne;
    }

    public String getPressing() {
        return pressing;
    }

    public void setPressing(String pressing) {
        this.pressing = pressing;
    }

    public String getPressingPhone() {
        return pressingPhone;
    }

    public void setPressingPhone(String pressingPhone) {
        this.pressingPhone = pressingPhone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public Date getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(Date entryDate) {
        this.entryDate = entryDate;
    }

    public String getOrgId() {
        return orgId;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }

    public String getDepId() {
        return depId;
    }

    public void setDepId(String depId) {
        this.depId = depId;
    }

    public String getPostId() {
        return postId;
    }

    public void setPostId(String postId) {
        this.postId = postId;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public Timestamp getLastDate() {
        return lastDate;
    }

    public void setLastDate(Timestamp lastDate) {
        this.lastDate = lastDate;
    }

    public String getRemark() {
        return remark;
    }

    public void setRemark(String remark) {
        this.remark = remark;
    }

    public String getCreateUser() {
        return createUser;
    }

    public void setCreateUser(String createUser) {
        this.createUser = createUser;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser;
    }

    public String getDevice() {
        return device;
    }

    public void setDevice(String device) {
        this.device = device;
    }

    public int getUpdateState() {
        return updateState;
    }

    public void setUpdateState(int updateState) {
        this.updateState = updateState;
    }

    public String getBusinessTypeId() {
        return businessTypeId;
    }

    public void setBusinessTypeId(String businessTypeId) {
        this.businessTypeId = businessTypeId;
    }

    public String getBusinessTypeName() {
        return businessTypeName;
    }

    public void setBusinessTypeName(String businessTypeName) {
        this.businessTypeName = businessTypeName;
    }

    public String getTorgId() {
        return torgId;
    }

    public void setTorgId(String torgId) {
        this.torgId = torgId;
    }

    public String getTorgIds() {
        return torgIds;
    }

    public void setTorgIds(String torgIds) {
        this.torgIds = torgIds;
    }

    public boolean isNew() {
        return false;
    }
}
