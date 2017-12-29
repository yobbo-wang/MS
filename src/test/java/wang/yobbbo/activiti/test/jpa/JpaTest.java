package wang.yobbbo.activiti.test.jpa;

import com.vaadin.service.ApplicationContext;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.web.context.ContextLoader;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;
import wang.yobbo.common.spring.SpringContextUtil;
import wang.yobbo.test.entity.LoanRequest;
import wang.yobbo.test.service.LoanRequestBean;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static junit.framework.TestCase.assertNotNull;
import static junit.framework.TestCase.assertTrue;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

/**
 * 利用activiti提供的测试类，测试activiti
 */
@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration("classpath:spring/spring-root.xml")
public class JpaTest{
    @Autowired
    private RuntimeService runtimeService;
    @Autowired
    private ProcessEngine processEngine;

    //部署流程
    public void deploy(){

    }

    //发布流程，并填写贷款相关信息
    //设置的信息会设置到 loanRequest 中
    /**
     * <serviceTask id="createLoanRequest" name="Create loan request"
     activiti:expression="${loanRequestBean.newLoanRequest(customerName, amount)}"
     activiti:resultVariable="loanRequest"/>
     设置变量值过程：首先会在Spring中查找 "loanRequestBean" bean
     找到bean后，查找newLoanRequest方法，执行newLoanRequest方法，参数以Map形式传入
     最后只存在loanRequest中。
     */
    @Test
    public void deployAndSetLoanInfo(){
        Map<String, Object> variables = new HashMap<String, Object>();
        variables.put("customerName", "小杨");
        variables.put("amount", 500000L); //申请10万
        ProcessInstance loanRequestProcess = runtimeService.startProcessInstanceByKey("LoanRequestProcess", variables);
        System.out.println("processDefinitionId: " + loanRequestProcess.getProcessDefinitionId());//LoanRequestProcess:2:5004
        System.out.println("name: " + loanRequestProcess.getName());//null
        System.out.println("ID: " + loanRequestProcess.getId()); //17501  25001
        System.out.println("Description: " + loanRequestProcess.getDescription());//null
    }

    //获取贷款相关信息
    @Test
    public void getLoadInfo(){
        Object value = runtimeService.getVariable("25001", "loanRequest"); //返回实例对象
        assertNotNull(value);
        assertTrue(value instanceof LoanRequest); //断言
        LoanRequest request = (LoanRequest) value;
        System.out.println("ID为：" + request.getId());
        System.out.println("NAME: " + request.getCustomerName());
        System.out.println("Amount为: " + request.getAmount().longValue());
        assertEquals("小杨", request.getCustomerName());
        assertEquals(500000L, request.getAmount().longValue());
        assertFalse(request.isApproved());
    }

    public void successLoad(){
        Map<String, Object> variables = new HashMap<String, Object>();
        variables.put("approvedByManager", Boolean.TRUE);
    }

    @Test
    public void getTask(){
        //查询张三任务
        List<Task> list = this.processEngine.getTaskService().createTaskQuery().taskAssignee("李四")
                .orderByTaskCreateTime().desc().list();
        for (Task task1 : list){
            System.out.println("任务ID：" + task1.getId());
            System.out.println("任务名称:" + task1.getName());
            System.out.println("任务的创建时间:" + task1.getCreateTime());
            System.out.println("任务的办理人:" + task1.getAssignee());
            System.out.println("流程实例ID:" + task1.getProcessInstanceId());
            System.out.println("执行对象ID:" + task1.getExecutionId());
            System.out.println("流程定义ID:" + task1.getProcessDefinitionId());
        }
    }

     // 完成我的任务,通过申请
    @Test
    public void compliteMyPersonTask() {
        // 任务ID
        Map<String, Object> variables = new HashMap<String, Object>();
        variables.put("approvedByManager", Boolean.TRUE);
        String taskId = "22505";
        this.processEngine.getTaskService().complete(taskId, variables);
        System.out.println("完成任务：任务ID:" + taskId);
    }

    // 完成我的任务
    @Test
    public void compliteMyPersonTaskFaild() {
        // 任务ID
        Map<String, Object> variables = new HashMap<String, Object>();
        variables.put("approvedByManager", Boolean.FALSE);
        String taskId = "25008";
        this.processEngine.getTaskService().complete(taskId, variables);
        System.out.println("完成任务：任务ID:" + taskId);
    }

    @Test
    public void queryTask(){
        System.out.println("任务数：" + runtimeService.createProcessInstanceQuery().count());
    }

}
