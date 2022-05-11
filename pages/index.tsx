import { Button, Divider, Form, Input, message } from 'antd';
import type { GetServerSideProps, NextPage } from 'next';
import Link from 'next/link';
import { Router } from 'next/router';
import { useEffect, useState } from 'react';
import { FaArrowRight } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import style from '../styles/Home.module.scss';
import {
  encrypt,
  getEnvironmentVariable,
  getNodeInfoFromNetworkId,
} from '../utils/common';
import {
  GenericPageProps,
  HttpPasteCreateRequest,
  HttpPasteCreateResponse,
  HttpResponse,
} from '../utils/interfaces';

interface PasteForm {
  content: string;
  title: string;
  password?: string;
}

interface HomeProps extends GenericPageProps {}

const Home: NextPage<HomeProps> = (props) => {
  const [buttonLoader, setButtonLoader] = useState<boolean>(false);
  const [pageLoader, setPageLoader] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('');
  const [txnId, setTxnId] = useState<string>('');
  const [pasteId, setPasteId] = useState<string>('');

  useEffect(() => {
    if (buttonLoader) {
      setButtonText('Creating...');
    } else {
      setButtonText('Create New Paste');
    }
  }, [buttonLoader]);

  useEffect(() => {
    const start = () => {
      setPageLoader(true);
    };

    const end = () => {
      setPageLoader(false);
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

  const onFinish = async (values: PasteForm) => {
    if (!values.title) {
      values.title = 'Untitled';
    }
    setButtonLoader(true);
    let request: HttpPasteCreateRequest = {
      content: values.password
        ? encrypt(values.content, values.password)
        : values.content,
      title: values.password
        ? encrypt(values.title, values.password)
        : values.title,
      isEncrypted: values.password ? true : false,
    };

    fetch('api/paste', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })
      .then((response) => response.json())
      .then((data: HttpResponse) => {
        const pasteData = data.data as HttpPasteCreateResponse;
        setTxnId(pasteData.txnId);
        setPasteId(pasteData.id);
        message.success(
          data.message ? data.message : 'Paste created successfully'
        );
      })
      .catch((err) => {
        console.error('error creating paste: ', err);
        message.error('Error creating paste');
      })
      .finally(() => {
        setButtonLoader(false);
      });
  };

  if (pageLoader) {
    return <Spinner />;
  }

  return (
    <>
      <h2>New Paste</h2>
      <Form className={style['form']} name={'paste-form'} onFinish={onFinish}>
        <Form.Item
          name={'content'}
          rules={[
            {
              required: true,
              message: 'Please input content',
            },
          ]}
        >
          <Input.TextArea
            rows={13}
            style={{ resize: 'none' }}
            placeholder='Content'
            autoComplete='new-paste-content'
          />
        </Form.Item>
        <Form.Item name={'title'} label='Paste Title'>
          <Input placeholder='Untitled' autoComplete='new-paste-title' />
        </Form.Item>

        <Form.Item
          className={style['password']}
          name={'password'}
          label='Password'
          rules={[
            {
              required: false,
            },
          ]}
        >
          <Input.Password autoComplete='new-paste-password' />
        </Form.Item>
        <br />
        <Form.Item>
          <Button
            htmlType={'submit'}
            type={'primary'}
            loading={buttonLoader}
            disabled={txnId ? true : false}
          >
            {buttonText}
          </Button>
        </Form.Item>
      </Form>

      <>
        {txnId ? (
          <>
            <p>
              Transaction Id:{' '}
              <Link
                href={`${
                  getNodeInfoFromNetworkId(
                    props.networkId ? props.networkId : ''
                  ).explorerUrl
                }/transactions/${txnId}`}
              >
                <a target={'_blank'}>{txnId}</a>
              </Link>
            </p>

            <p>
              <Link href={`${props.host}/${pasteId}`}>
                <a style={{ display: 'flex', alignItems: 'center' }}>
                  View Paste <FaArrowRight style={{ marginLeft: '5px' }} />
                </a>
              </Link>
            </p>
          </>
        ) : (
          <></>
        )}
      </>

      <Divider />
      <p className={style['about']}>
        NEAR Paste is an open-source blockchain-based Pastebin built on NEAR
        Protocol. The server has zero knowledge about any pasted data. Data is
        encrypted/decrypted using AES encryption in the browser itself.
      </p>
      <p className={style['about']}>
        Pasted data sent to blockchain is visible in Explorer. It is recommended
        to use password.
      </p>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      host: context.req.headers.host
        ? 'http://' + context.req.headers.host
        : '',
      networkId: getEnvironmentVariable('NEAR_NETWORK_ID'),
    },
  };
};

export default Home;
