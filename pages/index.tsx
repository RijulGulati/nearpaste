import { Button, Divider, Form, Input } from 'antd';
import { FinalExecutionStatus } from 'near-api-js/lib/providers';
import type { NextPage } from 'next';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import style from '../styles/Home.module.scss';
import { Paste } from '../utils/common';

interface PasteForm {
  content: string;
  title: string;
  password?: string;
}

enum PasteStatus {
  SUCCESS,
  ERROR,
}

const Home: NextPage = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [buttonText, setButtonText] = useState<string>('');
  const [pasteStatus, setPasteStatus] = useState<number>(PasteStatus.SUCCESS);

  useEffect(() => {
    if (loader) {
      setButtonText('Creating Paste...');
    } else {
      setButtonText('Create New Paste');
    }
  }, [loader]);

  const onFinish = async (values: PasteForm) => {
    debugger;
    try {
      setLoader(true);
      const paste = new Paste(values.title, values.content, values.password);
      let result = await paste.createPaste();
      setLoader(false);
      setPasteStatus(PasteStatus.SUCCESS);
      console.log('Transaction hash: ', result.transaction_outcome.id);
      console.log('Gas burnt: ', result.transaction_outcome.outcome.gas_burnt);
    } catch (err) {
      setLoader(false);
      setPasteStatus(PasteStatus.ERROR);
      console.error(err);
    }
  };

  const onFinishFailed = (error: any) => {
    console.log('Failed: ', error);
  };

  return (
    <>
      <h2>New Paste</h2>
      <Form
        className={style['form']}
        name={'paste-form'}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name={'title'}
          rules={[
            {
              required: true,
              message: 'Please input title',
            },
          ]}
        >
          <Input placeholder='Title' />
        </Form.Item>
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
          />
        </Form.Item>
        <Form.Item>
          <Button htmlType={'submit'} type={'primary'} loading={loader}>
            {buttonText}
          </Button>
        </Form.Item>
      </Form>

      <Divider />
      <>
        {pasteStatus == PasteStatus.ERROR ? (
          <>
            <h2>Error creating paste</h2>
          </>
        ) : pasteStatus == PasteStatus.SUCCESS ? (
          <>
            <h2>Paste created</h2>
            <p>Transaction Id: {}</p>
            <p>View in explorer: {}</p>
            <p>
              <Link href={`#`}>
                <a>View Paste</a>
              </Link>
            </p>
          </>
        ) : (
          <></>
        )}
      </>
    </>
  );
};

export default Home;
