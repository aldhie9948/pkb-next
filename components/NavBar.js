import { IoPeopleCircle, IoHome, IoLogOutOutline } from 'react-icons/io5';
import { RiUserSharedFill } from 'react-icons/ri';
import Image from 'next/image';
import LogoPKB from '../public/img/Logo_PKB.svg';
import Link from 'next/link';

const NavBar = () => {
  const NavItem = ({ text, Icon, className }) => {
    return (
      <div
        className={`sm:hover:border-l-8 sm:hover:border-green-600 group flex align-bottom relative cursor-pointer shadow-lg bg-green-500 p-2 rounded-lg hover:rounded duration-100 text-white active:bg-green-600 ${className}`}
      >
        <Icon className='sm:text-[1.5em]' />
        <span className='sm:pl-2 hidden sm:block'>{text}</span>
        <div
          className={`sm:hidden scale-0 whitespace-nowrap group-hover:scale-100 absolute top-0 left-[3.5em] bg-black text-white py-1 px-4 rounded duration-100 text-sm z-50`}
        >
          {text}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`h-screen relative duration-200 py-4 px-2 box-border bg-white navbar w-[3em] sm:w-[18em]`}
    >
      <div className='navbar-brand py-5 '>
        <Image src={LogoPKB} alt='logo pkb' />
      </div>
      <div className='flex flex-col gap-5'>
        <Link href='/'>
          <a>
            <NavItem text='Dashboard' Icon={IoHome} />
          </a>
        </Link>
        <Link href='/demografi'>
          <a>
            <NavItem text='Demografi' Icon={IoPeopleCircle} />
          </a>
        </Link>
        <Link href='/anggota'>
          <a>
            <NavItem text='Anggota' Icon={RiUserSharedFill} />
          </a>
        </Link>
        <Link href='/logout'>
          <a>
            <NavItem text='Logout' Icon={IoLogOutOutline} />
          </a>
        </Link>
      </div>
    </div>
  );
};

export default NavBar;
