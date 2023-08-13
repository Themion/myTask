import HeaderUser from '~/components/Header/User';
import './styles.scss';

const Header = () => {
  return (
    <header className="header">
      <span className="header__logo">logo</span>
      <nav className="header__nav">
        <ul className="header__nav--ul">
          <li>menu 1</li>
          <li>menu 2</li>
          <li>menu 3</li>
        </ul>
      </nav>
      <HeaderUser />
    </header>
  );
};

export default Header;
