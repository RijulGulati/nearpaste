import { Button, Divider, Form, Input } from 'antd';
import type { NextPage } from 'next';
import style from '../styles/Home.module.scss';

interface PasteForm {
  content: string;
  title: string;
}

const Home: NextPage = () => {
  const onFinish = (values: PasteForm) => {
    debugger;
    console.log('Success: ', values);
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
          <Button htmlType={'submit'} type={'primary'}>
            Create New Paste
          </Button>
        </Form.Item>
      </Form>

      <Divider />
    </>
  );
};

export default Home;
