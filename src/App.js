import {BrowserRouter, useNavigate} from 'react-router-dom';
import CustomRouter from './routes';
import Navbar from './components/common/NavBar';
import './styles/main.scss'
import { useState,useEffect } from 'react';
import { IoChatbox } from 'react-icons/io5';
import CurrentActivityBox from './components/common/CurrentActivityBox';
import { isLoggedIn } from './utils/tokenutils';
function App() {
  
  const isUserLoggedin = isLoggedIn();
  return (
    <BrowserRouter >
      <Navbar/>
      <div className='min-h-[100vh] main-container bg-gray-100  pt-[180px] px-6 no-scrollbar'>
          <CustomRouter/>
      {isUserLoggedin?  (<CurrentActivityBox/>):(<div></div>) }
    
      </div>

    </BrowserRouter>
  );
}

export default App;