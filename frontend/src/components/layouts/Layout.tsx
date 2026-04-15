import {FC} from 'react';
import {Outlet} from 'react-router-dom';

//layouts 내 컴포넌트
import Header from './Header';
import Footer from './Footer';

const Layout: FC = () => {
  return (
      <div className='flex flex-col min-h-screen bg-background text-font-main transition-colors duration-300'>
        <Header/>

        <main className='flex-grow container mx-auto px-4 py-8'>
          <Outlet/>
        </main>

        <Footer/>
      </div>
  );
};

export default Layout;
