package wang.yobbo.sys.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import wang.yobbo.sys.service.SysService;

@Controller
@RequestMapping(value = "/sys/init")
public class SysController {

    @Autowired
    private SysService sysService;

    @RequestMapping(value = "login", method = RequestMethod.GET)
    public String toSys(){
        this.sysService.getInfo();
        System.out.println("初始化");
        return "index";
    }
}
