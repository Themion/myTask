import { useNavigate } from 'react-router-dom';
import styles from './styles.module.scss';

const HeaderLogo = () => {
  const navigate = useNavigate();
  const onClick = () => navigate('/');
  return (
    <div className={styles.logo}>
      <span onClick={onClick}>logo</span>
    </div>
  );
};

export default HeaderLogo;
