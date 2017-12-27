package wang.yobbo.common.spring;

import org.springframework.beans.BeansException;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;

/**
 * Spring工具类
 */
public class SpringContextUtil implements ApplicationContextAware {
    private static ApplicationContext applicationContext;

    public static ApplicationContext getApplicationContext() {
        return applicationContext;
    }

    //提供set方法自动注入
    public void setApplicationContext(ApplicationContext applicationContext) throws BeansException {
        SpringContextUtil.applicationContext = applicationContext;
    }
    //通过名称获取Bean
    public static Object getBean(String name) throws BeansException {
        return applicationContext.getBean(name);
    }

    //通过Class获取Bean
    public static Object getBean(Class<?> _class){
        return applicationContext.getBean(_class);
    }
}
