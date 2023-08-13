import HeaderLogo from './Logo';
import HeaderNav from './Nav';
import HeaderUser from './User';
import './styles.scss';

const Header = () => {
  return (
    <header className="header">
      <HeaderLogo />
      <HeaderNav />
      <HeaderUser />
    </header>
  );
};

export default Header;
