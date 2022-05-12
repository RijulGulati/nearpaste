import { Button, Form, Input, message, Space, Spin, Tooltip } from 'antd';
import { GetServerSideProps, NextPage } from 'next';
import style from '../../styles/Paste.module.scss';
import { DownloadOutlined, CopyOutlined } from '@ant-design/icons';
import { decrypt, getPasteUx } from '../../utils/common';
import { useEffect, useState } from 'react';
import { Router, useRouter } from 'next/router';
import { GenericPageProps, PasteUx } from '../../utils/interfaces';
import Spinner from '../../components/Spinner';
import Link from 'next/link';

interface PastePassword {
  password: string;
}

interface PasteDetailsProps extends GenericPageProps {
  paste: PasteUx;
}

const Paste: NextPage<PasteDetailsProps> = (props) => {
  const router = useRouter();
  const [paste, setPaste] = useState<PasteUx>(props.paste);
  const [loader, setLoader] = useState<boolean>(false);

  useEffect(() => {
    const start = () => {
      setLoader(true);
    };

    const end = () => {
      setLoader(false);
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
  } else {
    if (paste) {
      const onFinish = async (values: PastePassword) => {
        let content = decrypt(paste.content, values.password);
        if (!content) {
          message.error('Incorrect Password');
        } else {
          setPaste({
            content: content,
            id: paste.id,
            title: decrypt(paste.title, values.password),
            isEncrypted: false,
            createdAt: paste.createdAt,
          });
        }
      };

      if (paste.isEncrypted) {
        return (
          <>
            <h2>Encrypted Paste</h2>
            <Form name={'paste-content-form'} onFinish={onFinish}>
              <Form.Item
                name={'password'}
                rules={[
                  {
                    required: true,
                    message: 'Please input password',
                  },
                ]}
              >
                <Input
                  className={style['textbox']}
                  placeholder='Enter Password'
                  type={'password'}
                />
              </Form.Item>
              <Form.Item>
                <Button htmlType={'submit'} type={'primary'}>
                  {'Submit'}
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      } else {
        return (
          <>
            <h2>{paste.title}</h2>
            <span className={style['content']}>
              <Input.TextArea
                className={style['textbox']}
                name={'paste-text'}
                defaultValue={paste.content}
                disabled
                rows={13}
              ></Input.TextArea>
              <p className={style['create-date']}>{paste.createdAt}</p>
              <br />
              <Space size={'large'}>
                <Button
                  type='primary'
                  icon={<DownloadOutlined />}
                  size={'middle'}
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.createElement('a');
                    const file = new Blob([paste.content], {
                      type: 'text/plain',
                    });
                    element.href = URL.createObjectURL(file);
                    element.download = `${paste.id}.txt`;
                    document.body.appendChild(element);
                    element.click();
                  }}
                >
                  {' '}
                  Download{' '}
                </Button>
                {props.paste.isEncrypted ? (
                  <></>
                ) : (
                  <Link type={'button'} href={`${paste.id}/raw`}>
                    <a target={'_blank'}>Raw</a>
                  </Link>
                )}
              </Space>
              <Input.Group className={style['url-group']}>
                <Input
                  className={style['url-box']}
                  defaultValue={`${props.host}/${paste.id}`}
                  disabled
                />
                <Tooltip title='copy paste url'>
                  <Button
                    icon={<CopyOutlined />}
                    onClick={async (e) => {
                      e.preventDefault();
                      await navigator.clipboard.writeText(
                        `${props.host}/${paste.id}`
                      );
                      message.success('Copied to clipboard');
                    }}
                  />
                </Tooltip>
              </Input.Group>
            </span>
          </>
        );
      }
    } else {
      return <h2>Paste not found!</h2>;
    }
  }
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.query;
  const host = context.req.headers.host
    ? 'http://' + context.req.headers.host
    : '';
  let paste: PasteUx | null = null;
  if (id) {
    let pasteId: string = '';
    if (Array.isArray(id)) pasteId = id[0];
    else {
      pasteId = id;
    }

    paste = await getPasteUx(host, pasteId);
  }

  return {
    props: {
      host: host,
      paste: paste,
    },
  };
};

export default Paste;
