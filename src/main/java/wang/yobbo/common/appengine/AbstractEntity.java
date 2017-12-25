package wang.yobbo.common.appengine;

import org.springframework.data.domain.Persistable;

import java.io.Serializable;

/**
 * Created by xiaoyang on 2017/12/25.
 */
public abstract class AbstractEntity<ID extends Serializable> implements Persistable<ID> {
    public abstract ID getId();
    public abstract void setId(ID var1);
}
