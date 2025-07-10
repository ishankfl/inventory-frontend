import { BrowserRouter } from 'react-router-dom';
import CustomRouter from './routes';
import Navbar from './components/common/NavBar';
import './styles/main.scss';
import { useState, useEffect } from 'react';
import { IoChatbox } from 'react-icons/io5';
import CurrentActivityBox from './components/common/CurrentActivityBox';
import { isLoggedIn } from './utils/tokenutils';

function App() {
  const isUserLoggedin = isLoggedIn();

  return (
    <BrowserRouter>
      <div className='!flex !flex-row !gap-24'>
        <Navbar />
        <div className='pt-24'>
          <CustomRouter  />
          {isUserLoggedin && <CurrentActivityBox />}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
