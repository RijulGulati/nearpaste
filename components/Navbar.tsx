import { Header } from 'antd/lib/layout/layout';
import { NextPage } from 'next';
import style from '../styles/Navbar.module.scss';
import { FaGithub } from 'react-icons/fa';
import Link from 'next/link';
import { Menu, Space } from 'antd';
import { useRouter } from 'next/router';

const Navbar: NextPage = () => {
  const router = useRouter();
  return (
    <>
      <Header className={`${style['navbar']}`}>
        <Link href={'/'}>
          <a>
            <h1 className={style['header']}>NEAR Pastes</h1>
          </a>
        </Link>

        <Link href={'https://github.com/RijulGulati/nearpastes'}>
          <a target={'_blank'}>
            <FaGithub className={style['fa-icon']}></FaGithub>
          </a>
        </Link>
      </Header>
    </>
  );
};

export default Navbar;
