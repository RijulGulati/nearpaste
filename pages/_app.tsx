import '../styles/globals.scss';
import type { AppProps } from 'next/app';
import Layout, { Content } from 'antd/lib/layout/layout';

import BaseStyle from '../styles/Base.module.scss';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Head from 'next/head';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Near Paste - Pastebin on NEAR Protocol</title>
      </Head>
      <Layout className={BaseStyle['layout']}>
        <Navbar />
        <Content className={`${BaseStyle['container']}`}>
          <Layout className={BaseStyle['content']}>
            <Content>
              <Component {...pageProps} />
            </Content>
          </Layout>
        </Content>
        <Footer />
      </Layout>
    </>
  );
}

export default MyApp;
