package wang.yobbbo.activiti;

import org.activiti.spring.impl.test.SpringActivitiTestCase;
import org.springframework.test.context.ContextConfiguration;

@ContextConfiguration(locations = "classpath:spring/spring-root.xml")
public class JpaTest extends SpringActivitiTestCase {

    public void testJpaVariableHappyPath() {
        before();
    }

    //部署
    protected void before(){
        String[] defs = { "JPASpringTest.bpmn20.xml" };
        for (String pd : defs)
            repositoryService.createDeployment().addClasspathResource(pd).deploy();
    }
}
