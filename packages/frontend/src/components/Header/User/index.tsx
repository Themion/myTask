import { useRecoilValue } from 'recoil';
import Dropdown from '~/components/Dropdown';
import { shouldRefreshAtom } from '~/recoil/atoms';
import styles from './styles.module.scss';

const HeaderUser = () => {
  const refreshed = useRecoilValue(shouldRefreshAtom);

  return (
    <Dropdown
      button={<span>user menu</span>}
      classList={[styles.user]}
      dropdownClassList={[styles.dropdown]}
    >
      {refreshed ? 'sign out' : 'sign in'}
    </Dropdown>
  );
};

export default HeaderUser;
