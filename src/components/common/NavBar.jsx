import { useEffect, useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../../styles/navbar.scss';
import { isLoggedIn } from '../../utils/tokenutils';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false); // renamed to 'loggedIn'
  const checkLoggedin=()=>{
    const isUserLoggedIn  = isLoggedIn();
        setLoggedIn(isUserLoggedIn);

    // setLoggedIn(isLoggedin);
  }
 useEffect(() => {
  checkLoggedin();
}, []);

  return (
    <div className="main-nav flex items-center justify-center p-8 fixed w-[100%] ">
       <div className=" navbar bg-primary z-[10000] flex justify-between items-center rounded-lg shadow-md mb-8 relative w-[80%] p-8 ">
      <div className="nav-logo text-[1.5rem] font-bold text-white">Welcome to IMS</div>

      <div className="nav-links hidden md:flex gap-5">
        <a className='nav-item' href="/dashboard">Dashboard</a>
        <a className='nav-item' href="/product">Product</a>
        <a className='nav-item' href="/issue-product">Issue Product</a>
        <a className='nav-item' href="/category">Category</a>
        <a className='nav-item' href="/users">Staff</a>
{!loggedIn && <a className='nav-item' href="/login">Login</a>}
        <a className='nav-item' href="/deprtments">Department</a>
      </div>

      <div className="md:hidden text-white z-50" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-primary flex flex-col items-center gap-4 py-4 md:hidden z-40">
          <a className='nav-item' href="/dashboard">Dashboard</a>
          <a className='nav-item' href="/product">Product</a>
          <a className='nav-item' href="/issue-product">Issue Product</a>
          <a className='nav-item' href="/category">Category</a>
          <a className='nav-item' href="/users">Staff</a>
          <a className='nav-item' href="/login">Login</a>
          <a className='nav-item' href="/deprtments">Department</a>
        </div>
      )}
    </div>
    </div>
   
  );
};

export default Navbar;
