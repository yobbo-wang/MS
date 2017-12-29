package wang.yobbo.sys.dao;

public interface UsersDao {

    void findBySql(String sql, Object...params);

    int findBySqlCount(String sql, Object ...params);
}
