import { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  getEnvironmentVariable,
  getNodeInfoFromNetworkId,
} from '../../utils/common';
import {
  GenericPageProps,
  HttpPasteAccountBalance,
  HttpPasteCountResponse,
} from '../../utils/interfaces';

import { formatNearAmount } from 'near-api-js/lib/utils/format';
import Spinner from '../../components/Spinner';
import { Router } from 'next/router';

interface StatsProps extends GenericPageProps {
  accountBalance: string;
  pasteCount: number;
  error: boolean;
}

const Stats: NextPage<StatsProps> = (props) => {
  const [loader, showLoader] = useState<boolean>(false);

  useEffect(() => {
    const start = () => {
      showLoader(true);
    };

    const end = () => {
      showLoader(false);
    };

    Router.events.on('routeChangeStart', start);
    Router.events.on('routeChangeComplete', end);
    Router.events.on('routeChangeError', end);

    return () => {
      Router.events.off('routeChangeStart', start);
      Router.events.off('routeChangeComplete', end);
      Router.events.off('routeChangeError', end);
    };
  }, []);

  if (loader) {
    return <Spinner />;
  }
  return (
    <>
      <h2>Stats</h2>
      <p>Total Pastes: {props.pasteCount}</p>
      <p>
        <Link
          href={`${
            getNodeInfoFromNetworkId(props.networkId ? props.networkId : '')
              .explorerUrl
          }/accounts/${props.accountId}`}
        >
          <a>{props.accountId}</a>
        </Link>{' '}
      </p>
      <p>
        Available balance: {props.accountBalance} (
        {formatNearAmount(props.accountBalance)} Ⓝ)
      </p>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const host = context.req.headers.host
    ? 'http://' + context.req.headers.host
    : '';
  let accountBalance: string = '';
  let pasteCount = 0;
  let isError: boolean = false;
  const promises = [
    fetch(`${host}/api/account/balance`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }),
    fetch(`${host}/api/paste/count`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }),
  ];

  try {
    let result = await Promise.all(promises);
    const jsonPromises = [result[0].json(), result[1].json()];
    let data = await Promise.all(jsonPromises);
    let balance = data[0].data as HttpPasteAccountBalance;
    let count = data[1].data as HttpPasteCountResponse;
    accountBalance = balance.balance.available;
    pasteCount = count.count;
  } catch (err) {
    isError = true;
  }

  return {
    props: {
      networkId: getEnvironmentVariable('NEAR_NETWORK_ID'),
      accountId: getEnvironmentVariable('NEAR_ACCOUNT_ID'),
      error: isError,
      accountBalance,
      pasteCount,
    },
  };
};

export default Stats;
