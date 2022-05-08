import { Button, Input, Space, Tooltip } from 'antd';
import { NextPage } from 'next';
import style from '../../styles/Paste.module.scss';
import { DownloadOutlined, CopyOutlined } from '@ant-design/icons';

const Paste: NextPage = () => {
  return (
    <>
      <h2>Paste Title</h2>
      <span className={style['content']}>
        <Input.TextArea
          className={style['textbox']}
          name={'paste-text'}
          defaultValue={
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque luctus hendrerit sapien non aliquam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum vitae feugiat urna. Integer quis interdum ex. Nunc facilisis felis eget nisi laoreet lobortis. Integer et laoreet urna. Nulla lacinia odio nec tortor rutrum porta. Sed auctor laoreet convallis. Phasellus non justo urna. Sed sollicitudin eros ut turpis vulputate, non mollis massa faucibus. Phasellus accumsan enim a neque ornare, nec sollicitudin justo eleifend. Mauris vehicula arcu sit amet dolor pharetra elementum.'
          }
          disabled
          rows={13}
        ></Input.TextArea>
        <br />
        <br />
        <Space size={'large'}>
          <Button type='primary' icon={<DownloadOutlined />} size={'middle'}>
            {' '}
            Download{' '}
          </Button>
          <Button type={'ghost'} size={'middle'}>
            {' '}
            Raw{' '}
          </Button>
        </Space>
        <Input.Group className={style['url-group']}>
          <Input
            className={style['url-box']}
            defaultValue='http://localhost:3000/test'
            disabled
          />
          <Tooltip title='copy url'>
            <Button icon={<CopyOutlined />} />
          </Tooltip>
        </Input.Group>
      </span>
    </>
  );
};

export default Paste;
