import { Spin } from 'antd';
import { NextPage } from 'next';
import style from '../styles/Spinner.module.scss';

const Spinner: NextPage = () => {
  return (
    <>
      <span className={style['spinner']}>
        <Spin size={'large'} />
      </span>
    </>
  );
};

export default Spinner;
