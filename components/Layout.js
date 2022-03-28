import Head from 'next/head';
import NavBar from './NavBar';

const Layout = ({ children, title }) => {
  const slogan = 'Database Partai Kebangkitan Bangsa';
  return (
    <div>
      <Head>
        <title>{title ? `${title} | ${slogan}` : slogan}</title>
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <link rel='mask-icon' href='/safari-pinned-tab.svg' color='#5bbad5' />
        <meta name='msapplication-TileColor' content='#00a300' />
        <meta name='theme-color' content='#ffffff' />
      </Head>
      <div className='flex gap-1'>
        <NavBar />
        <div className='sm:p-10 p-5 bg-slate-100 shrink w-full overflow-y-auto'>
          <div className='lg:w-10/12 lg:mx-auto'>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
