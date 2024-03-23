import React, { useState } from 'react';
import { Bars3BottomRightIcon, XMarkIcon, StarIcon } from '@heroicons/react/24/solid';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';

const NavBar2 = () => {
    const [open, setOpen] = useState(false);

    const Links = [
        { name: "Home", link: "/" },
        { name: "About Us", link: "/" },
        { name: "What We Do", link: "/" },
        { name: "Meet Mento", link: "/" },
        { name: "Contact", link: "/" }
    ];

    return (
        <div className='shadow-md w-full fixed top-0 left-0 '>
            <div className='md:flex items-center justify-between bg-white py-4 md:px-10 px-7'  style={{  height:'80px' }}>
                {/* logo section */}
                <div className='font-bold text-2xl cursor-pointer flex items-center gap-1'>
                    <span>BabyVaxPro</span>
                </div>
                {/* Menu icon */}
                <div onClick={() => setOpen(!open)} className='absolute right-8 top-6 cursor-pointer md:hidden w-7 h-7'>
                    {open ? <XMarkIcon /> : <Bars3BottomRightIcon />}
                </div>
                {/* link items */}
                <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9 transition-all duration-500 ease-in ${open ? 'top-12' : 'top-[-490px]'}`}>
                    {Links.map((link, index) => (
                        <li key={index} className='md:ml-8 md:my-0 my-7 font-semibold'>
                            <a href={link.link} className='text-gray-800 hover:text-blue-400 duration-500'>{link.name}</a>
                        </li>
                    ))}
                    <li className='md:ml-10 md:my-0 my-7 font-semibold'>
                        <a href="/" className='text-gray-800 hover:text-blue-400 duration-500 flex items-center gap-1'>
                            <CircleNotificationsIcon className='w-7 h-7 text-bllack-600' style={{ width: '40px', height:'40px' }}/>
                          
                        </a>
                    </li>
                    <button style={{ width: '100px' }} className='btn bg-black text-white md:ml-8 font-semibold px-3 py-1 rounded duration-500 md:static' onClick={() => { window.location.href = '/' }}>Logout</button>
                </ul>
                {/* button */}
            </div>
        </div>
    );
};

export default NavBar2;
