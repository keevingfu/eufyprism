import React from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css';

const { defaultAlgorithm } = theme;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Eufy E28 DAM - Digital Asset Management</title>
        <meta name="description" content="Enterprise-grade digital asset management system" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ConfigProvider
        theme={{
          algorithm: defaultAlgorithm,
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <Component {...pageProps} />
      </ConfigProvider>
    </>
  );
}

export default MyApp;