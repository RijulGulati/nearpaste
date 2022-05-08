import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';

interface StatsProps {
  showHeading?: boolean;
}

const Stats: NextPage<StatsProps> = (props) => {
  return (
    <>
      {props.showHeading ? <h2>Stats</h2> : <></>}
      <p>Total Pastes: 140</p>
      <p>
        <Link href={'#'}>
          <a>nearpastes.rijul.testnet</a>
        </Link>{' '}
      </p>
      <p>Available balance: 0.5N</p>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      showHeading: true,
    },
  };
};

export default Stats;
