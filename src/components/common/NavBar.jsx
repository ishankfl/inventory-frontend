import { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import '../../styles/navbar.scss';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="navbar bg-primary z-[10000] flex justify-between items-center px-8 py-4 rounded-lg shadow-md mb-8 relative">
      <div className="nav-logo text-[1.5rem] font-bold text-white">IMS</div>

      {/* Desktop Links */}
      <div className="nav-links hidden md:flex gap-5">
        <a className='nav-item' href="/dashboard">Dashboard</a>
        <a className='nav-item' href="/product">Product</a>
        <a className='nav-item' href="/issue-product">Issue Product</a>
        <a className='nav-item' href="/category">Category</a>
        <a className='nav-item' href="/users">Staff</a>
        <a className='nav-item' href="/login">Login</a>
        <a className='nav-item' href="/deprtments">Department</a>
      </div>

      {/* Hamburger Icon */}
      <div className="md:hidden text-white z-50" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </div>

      {/* Mobile Menu */}
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
  );
};

export default Navbar;
