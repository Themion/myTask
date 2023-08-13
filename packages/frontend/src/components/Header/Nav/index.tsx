import Dropdown from '~/components/Dropdown';
import styles from './styles.module.scss';

const HeaderNav = () => {
  return (
    <div className={styles.nav}>
      <nav>
        <ul>
          <li>
            <Dropdown dropdownClassList={[styles.dropdown]} button={<span>menu 1</span>}>
              menu 1 dropdown
            </Dropdown>
          </li>
          <li>menu 2</li>
          <li>menu 3</li>
        </ul>
      </nav>
    </div>
  );
};
export default HeaderNav;
