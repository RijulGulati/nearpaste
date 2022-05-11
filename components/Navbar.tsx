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
        <span>
          <Link href={'/'}>
            <a>
              <h1 className={style['header']}>NEAR Paste</h1>
            </a>
          </Link>
        </span>

        <span className={style['right-content']}>
          <Link href={'/stats'}>
            <a>
              <span className={style['text']}>Stats</span>
            </a>
          </Link>

          <Link href={'https://github.com/RijulGulati/nearpaste'}>
            <a target={'_blank'}>
              <FaGithub className={style['fa-icon']}></FaGithub>
            </a>
          </Link>
        </span>
      </Header>
    </>
  );
};

export default Navbar;
