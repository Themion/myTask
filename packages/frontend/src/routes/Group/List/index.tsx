import styles from './styles.module.scss';

const GroupList = () => {
  const groups = new Array(10).fill(0).map((_, i) => ({ id: i, name: `name${i}` }));

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>Groups</h2>
      <div className={styles.list}>
        {groups.map((group) => (
          <div key={group.id} className={styles.item}>
            <span className={styles.text}>{group.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupList;
