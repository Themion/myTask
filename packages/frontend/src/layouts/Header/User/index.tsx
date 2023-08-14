import { Dropdown } from '~/components';
import AuthMenu from './Auth';
import styles from './styles.module.scss';

const HeaderUser = () => {
  return (
    <Dropdown
      button={<span>user menu</span>}
      classList={[styles.user]}
      dropdownClassList={[styles.dropdown]}
    >
      <AuthMenu />
    </Dropdown>
  );
};

export default HeaderUser;
