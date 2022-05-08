import { Divider } from 'antd';
import Sider from 'antd/lib/layout/Sider';
import { NextPage } from 'next';
import Link from 'next/link';
import Stats from '../pages/stats';
import style from '../styles/Sidebar.module.scss';

const Sidebar: NextPage = () => {
  return (
    <Sider className={style['sider']} width={180}>
      <div>
        <div className={style['sider-entry']}>
          <span className={style['heading']}>Stats</span>
          <div className={style['recent-posts']}>
            <Stats showHeading={false} />
          </div>
        </div>
      </div>
    </Sider>
  );
};

export default Sidebar;
