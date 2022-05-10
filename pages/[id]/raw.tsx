import { GetServerSideProps, NextPage } from 'next';
import { getPasteUx } from '../../utils/common';
import { PasteUx } from '../../utils/interfaces';

const RawPaste: NextPage = () => {
  return <></>;
};

export default RawPaste;

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
    if (paste) {
      context.res.write(paste.content);
    } else {
      context.res.write('Paste not found');
    }
  } else {
    context.res.write('No id provided');
  }
  context.res.end();
  return {
    props: {},
  };
};
