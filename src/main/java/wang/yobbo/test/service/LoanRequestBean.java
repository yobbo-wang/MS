package wang.yobbo.test.service;

import org.springframework.stereotype.Service;
import wang.yobbo.test.entity.LoanRequest;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

@Service
public class LoanRequestBean {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * 商店贷款信息
     * @param customerName 贷款人
     * @param amount 数目
     * @return 贷款信息对象
     */
    public LoanRequest newLoanRequest(String customerName, Long amount){
        LoanRequest lr = new LoanRequest();
        lr.setCustomerName(customerName);
        lr.setAmount(amount);
        lr.setApproved(false);
        entityManager.persist(lr); //保存的数据库
        return lr; //返回给activiti
    }

    //获取贷款相关信息
    public LoanRequest getLoanRequest(Long id){
        System.out.println("贷款信息对象ID为: " + id);
        return this.entityManager.find(LoanRequest.class, id);
    }
}
