package wang.yobbo.sys.workflow.service;

import org.activiti.engine.*;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.runtime.ProcessInstance;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import wang.yobbo.sys.dao.UsersDao;
import wang.yobbo.sys.exception.ProcessInstancesIsNotInactiveException;
import wang.yobbo.sys.util.IOUtils;
import wang.yobbo.sys.workflow.entity.StatefulEntity;

import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by xiaoyang on 2017/12/23.
 * 流程管理服务类
 */
@Service
public class WorkflowService {
    private final Logger logger = Logger.getLogger(WorkflowService.class);

    @Autowired private RepositoryService repositoryService;
    @Autowired private RuntimeService runtimeService;
    @Autowired private TaskService taskService;
    @Autowired private HistoryService historyService;
    @Autowired private ManagementService managementService;
    @Autowired private IdentityService identityService;
    @Autowired private UsersDao usersDao;

    /**
     * 部署流程
     * @param resourceName 资源名称
     * @param inputStream 资源流
     */
    public void deploy(String resourceName, InputStream inputStream){
        this.repositoryService.createDeployment().addInputStream(resourceName, inputStream).enableDuplicateFiltering().deploy();
    }

    /**
     * 删除流程
     * @param deploymentId
     */
    public void deleteDeploy(String deploymentId){
        //根据流程id，查找流程
        ProcessDefinition processDefinition = this.repositoryService.createProcessDefinitionQuery().deploymentId(deploymentId).singleResult();
        if(null == processDefinition) return;
        try{
            this.repositoryService.deleteDeployment(deploymentId, false);
        }catch (ProcessInstancesIsNotInactiveException e){
            logger.error("删除流程异常：" + e.getMessage());
            throw new ProcessInstancesIsNotInactiveException(e.getMessage()); // 抛出为了事务回滚
        }
    }

    /**
     * 删除部署内容，支持级联删除
     * @param deploymentId
     * @param cascade 为true做级联删除
     */
    public void deleteDeploy(String deploymentId,boolean cascade) {
        ProcessDefinition definition = repositoryService.createProcessDefinitionQuery().deploymentId(deploymentId).singleResult();
        if (null == definition) return;
        repositoryService.deleteDeployment(definition.getId(), cascade);
    }

    /**
     * 获得资源文件
     * @param output 流容器
     * @param deploymentId 流程ID
     * @throws IOException
     */
    public void getProcessModal(OutputStream output, String deploymentId) throws IOException {
        ProcessDefinition definition = repositoryService.createProcessDefinitionQuery().deploymentId(deploymentId).singleResult();
        if (definition != null) return;
        InputStream ins = repositoryService.getProcessModel(definition.getId());
        IOUtils.byteToOutputStream(IOUtils.toByteArray(ins), output);
    }

    /**
     * 启动流程
     * @param entity 流程相关的业务实体
     * @param initiator 流程创建人ID
     * @param processKey 流程启动的key
     * @param appName 应用名称
     * @param appURI 应用URI
     * @param variables 流程变量信息
     */
    public void startProcess(StatefulEntity entity, Long initiator, String processKey,
                             String appName, String appURI, Map<String, Object> variables){
        if(null == variables) variables = new HashMap<String, Object>();
        variables.put(VAR_APP_NAME, appName);
        variables.put(VAR_APP_URI, appURI);
        variables.put(VAR_OWNER_TABLE, entity.getClass().getName());
        variables.put(VAR_OWNER_ID, entity.getID());
        variables.put(VAR_CREATOR, initiator);
        if(null != initiator) variables.put(VAR_CREATOR_NAME, usersDao.findOne(initiator).getUsername());
        variables.put(VAR_CREATE_DATE_TIME, new Date());
        this.identityService.setAuthenticatedUserId(initiator.toString()); //设置授权用户信息
        ProcessInstance processInstance = this.runtimeService.startProcessInstanceByKey(processKey, variables);
        if(null != processInstance){
            //更新业务信息
            System.out.print("更新业务信息");
            //TODO
        }


    }

    private static final String VAR_APP_NAME = "APP_NAME"; //应用名
    private static final String VAR_APP_URI = "APP_URI"; //应用访问地址
    private static final String VAR_OWNER_TABLE = "OWNER_TABLE"; //应用主对象名
    private static final String VAR_OWNER_ID = "OWNER_ID"; //应用主对象ID
    private static final String VAR_CREATOR = "CREATOR"; //创建者账号
    private static final String VAR_CREATOR_NAME = "CREATOR_NAME"; //创建者姓名
    private static final String VAR_CREATE_DATE_TIME = "CREATE_DATE_TIME"; //创建时间

}
