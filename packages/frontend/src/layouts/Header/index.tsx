import HeaderLogo from './Logo';
import HeaderNav from './Nav';
import HeaderUser from './User';
import styles from './styles.module.scss';

const Header = () => {
  return (
    <header className={styles.header}>
      <HeaderLogo />
      <HeaderNav />
      <HeaderUser />
    </header>
  );
};

export default Header;
