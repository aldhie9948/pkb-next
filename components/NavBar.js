import { FaBars, FaTimes } from 'react-icons/fa';
import { IoPeopleCircle, IoHome, IoLogOutOutline } from 'react-icons/io5';
import { RiUserSharedFill } from 'react-icons/ri';
import { useState } from 'react/cjs/react.development';
import Image from 'next/image';
import LogoPKB from '../public/img/Logo_PKB.svg';
import Link from 'next/link';

const NavBar = () => {
  const [visible, setVisible] = useState(false);
  const navbarHandler = () => {
    setVisible(!visible);
  };

  const NavItem = ({ text, children, className }) => {
    const hover = `hover:border-l-8 hover:border-green-600`;
    return (
      <div
        className={`${
          visible && hover
        } group flex align-bottom relative cursor-pointer shadow-lg bg-green-500 p-2 rounded-lg hover:rounded duration-100 text-white active:bg-green-600 ${className}`}
      >
        {children}
        {visible && <span className='pl-2'>{text}</span>}
        <div
          className={`${
            visible ? 'hidden' : 'block'
          } scale-0 whitespace-nowrap group-hover:scale-100 absolute top-0 left-[3.5em] bg-black text-white py-1 px-4 rounded duration-100 text-sm`}
        >
          {text}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`h-screen relative duration-200 py-4 px-2 box-border bg-white navbar w-[3em] ${
        visible && 'w-[18em]'
      }`}
    >
      <div className='navbar-toggle flex justify-end' onClick={navbarHandler}>
        {visible ? (
          <FaTimes size='2em' className='p-1 cursor-pointer' />
        ) : (
          <FaBars size='2em' className='p-1 cursor-pointer' />
        )}
      </div>
      <div className='navbar-brand py-5 '>
        <Image src={LogoPKB} alt='logo pkb' />
      </div>
      <div className='flex flex-col gap-5'>
        <Link href='/'>
          <a>
            <NavItem text={`Dashboard`}>
              <IoHome size={visible && '1.5em'} />
            </NavItem>
          </a>
        </Link>
        <Link href='/demografi'>
          <a>
            <NavItem text={`Demografi`}>
              <IoPeopleCircle size={visible && '1.5em'} />
            </NavItem>
          </a>
        </Link>
        <Link href='/anggota'>
          <a>
            <NavItem text={`Anggota`}>
              <RiUserSharedFill size={visible && '1.5em'} />
            </NavItem>
          </a>
        </Link>
        <Link href='/logout'>
          <a>
            <NavItem className={`mt-6`} text={`Logout`}>
              <IoLogOutOutline size={visible && '1.5em'} />
            </NavItem>
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
