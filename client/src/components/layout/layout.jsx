import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../header/header';
import Footer from '../footer/footer';
import Links from '../links/links';

function Layout() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Links />
      <Footer />
    </>
  );
}

export default Layout;
