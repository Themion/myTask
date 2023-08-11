const Header = () => {
  return (
    <header style={{ display: 'flex' }}>
      <span>logo</span>
      <nav>
        <ul style={{ margin: '0', display: 'flex' }}>
          <li>menu 1</li>
          <li>menu 2</li>
          <li>menu 3</li>
        </ul>
      </nav>
      <span>user menu</span>
    </header>
  );
};

export default Header;
