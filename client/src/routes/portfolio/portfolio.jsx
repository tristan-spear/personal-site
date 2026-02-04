import React from 'react';
import Header from '../../components/header/header';
import Footer from '../../components/footer/footer';
import Links from '../../components/links/links';
import './portfolio.css';


function Portfolio() {
  return (
    <div className="portfolio">
      <Header />
      <Links />
      <Footer />
    </div>
  );
}

export default Portfolio;