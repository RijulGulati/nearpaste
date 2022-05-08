import { Divider, Space } from 'antd';
import { Footer as AntFooter } from 'antd/lib/layout/layout';
import { NextPage } from 'next';
import Link from 'next/link';
import { FaGithub, FaGlobe, FaTelegram } from 'react-icons/fa';
import style from '../styles/Footer.module.scss';

const Footer: NextPage = () => {
  return (
    <>
      <AntFooter className={style['footer']}>
        <Link href={'/stats'}>
          <a className={style['stats-link']}>Stats</a>
        </Link>
        <span className={style['copyright']}>© Rijul Gulati</span>
        <span>
          <Space size={'middle'}>
            <Link href={'https://rijulgulati.com'}>
              <a target={'_blank'}>
                <FaGlobe className={style['fa-icon']} />
              </a>
            </Link>
            <Link href={'https://github.com/RijulGulati'}>
              <a target={'_blank'}>
                <FaGithub className={style['fa-icon']} />
              </a>
            </Link>
            <Link href={'https://t.me/rijulgulati'}>
              <a target={'_blank'}>
                <FaTelegram className={style['fa-icon']} />
              </a>
            </Link>
          </Space>
        </span>
      </AntFooter>
    </>
  );
};

export default Footer;
