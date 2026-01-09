import React, {useEffect, useRef, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOut, faUserSecret, faGear, faHouse } from '@fortawesome/free-solid-svg-icons';
import icon from '../assets/images/updatedLogo.png'
import avatar from '../assets/images/avatar.jpg'
import {useLocation, useNavigate} from "react-router-dom";
import {getKey} from "../helpers/getKey";
import {useAppContext} from "../helpers/Context/AppContext";


const Header = () => {
    const navigate = useNavigate()
    const { value } = useAppContext();
    const menuRef = useRef(null);
    const buttonRef = useRef(null)
    const location = useLocation()

    const [userData] = useState(value?.user)
    const [drop, setDrop] = useState(false)


    const handleLogout = () => {
        localStorage.clear()
        navigate('/')
    }

    const handleOutsideClick = (event) => {
        if (
            menuRef.current &&
            !menuRef.current.contains(event.target) &&
            buttonRef.current &&
            !buttonRef.current.contains(event.target)
        ) {
            setDrop(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);
        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return(
        <div className="bg-blue-950 flex h-12 sm:h-14 md:h-16 w-full py-1 sm:py-1.5 md:py-2 px-2 sm:px-3 md:px-4 lg:px-5 justify-between items-center shadow-md border-b border-blue-900">
            <img 
                src={icon} 
                alt={'X Finance Bull Logo'} 
                className='cursor-pointer h-6 sm:h-7 md:h-8 lg:h-10 w-auto max-w-[100px] sm:max-w-[120px] md:max-w-[150px] lg:max-w-[200px] object-contain transition-opacity duration-200 hover:opacity-90' 
                onClick={() => {
                    window.open('https://www.xfinancebull.com', '_blank');
                }} 
            />
            {!getKey() ?
                <button 
                    className="bg-gradient-to-r from-[#d99b2c] via-[#ae6b00] to-[#da8100] hover:from-[#efb55a] hover:via-[#b76a00] hover:to-[#ff8f1a] font-semibold text-white py-1 sm:py-1.5 px-2 sm:px-3 md:px-4 rounded-md text-xs sm:text-sm flex items-center gap-1 sm:gap-1.5 transition-all duration-200 hover:shadow-lg active:scale-95 shadow-md" 
                    onClick={() => {
                        navigate('/login')
                    }}
                >
                    <FontAwesomeIcon icon={faUser} size="sm" color="#ffffff" className={'flex-shrink-0'}/>
                    <span className="hidden xs:inline">Login</span>
                </button> : <div className="relative inline-block text-left">
                    <div>
                        <button 
                            type="button"
                            ref={buttonRef}
                            onClick={() => setDrop(!drop)}
                            className={`inline-flex items-center gap-1 sm:gap-1.5 md:gap-2 rounded-md sm:rounded-lg bg-[#1e3a5f] px-2 sm:px-2.5 md:px-3 py-1 sm:py-1.5 md:py-2 text-xs sm:text-sm font-medium text-white shadow-md hover:bg-[#1e4a7f] hover:shadow-lg transition-all duration-200 active:scale-95 border border-blue-800/50 ${drop ? 'bg-[#1e4a7f] shadow-lg' : ''}`}
                            id="menu-button" 
                            aria-expanded={drop}
                            aria-haspopup="true"
                        >
                            {/* Avatar */}
                            <div className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 rounded-full overflow-hidden border-2 border-white/20 flex-shrink-0 shadow-sm">
                                <img 
                                    src={avatar} 
                                    alt={userData?.email || 'User'}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {/* Email/Username - Hidden on mobile, shown on tablet and up */}
                            <span className="text-white text-xs sm:text-sm font-medium hidden sm:inline-block max-w-[80px] md:max-w-[120px] lg:max-w-none truncate">
                                {userData?.email || 'User'}
                            </span>
                            {/* Gear Icon - Hidden on very small screens */}
                            <FontAwesomeIcon icon={faGear} size="sm" color="#ff700c" className="flex-shrink-0 hidden xs:inline opacity-90" />
                            {/* Chevron Icon */}
                            <svg className={`w-3 h-3 text-white flex-shrink-0 transition-transform duration-200 ${drop ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"
                                 aria-hidden="true" data-slot="icon">
                                <path fillRule="evenodd"
                                      d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
                                      clipRule="evenodd"/>
                            </svg>
                        </button>
                    </div>

                    {drop && <div
                        ref={menuRef}
                        className="absolute right-0 z-50 mt-1.5 w-48 sm:w-56 origin-top-right rounded-md bg-white ring-1 ring-blue-200 shadow-xl focus:outline-none transition-all duration-200 ease-out opacity-100 transform translate-y-0"
                        role="menu" 
                        aria-orientation="vertical" 
                        aria-labelledby="menu-button" 
                        tabIndex="-1"
                    >
                        <div className="py-1" role="none">
                            <div className="border-b border-blue-100 px-3 py-2 mb-0.5">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-0.5">
                                    Signed in as
                                </p>
                                <p className="text-xs font-semibold text-gray-900 break-all leading-tight">
                                    {userData?.email}
                                </p>
                            </div>
                            <button
                                onClick={() => {
                                    navigate('/profile')
                                    setDrop(!drop)
                                }} 
                                className="w-full text-left cursor-pointer hover:bg-blue-50 active:bg-blue-100 block px-3 py-1.5 text-xs sm:text-sm text-gray-700 flex items-center gap-2 transition-colors duration-150"
                                role="menuitem" 
                                tabIndex="-1"
                                id="menu-item-1"
                            >
                                <FontAwesomeIcon icon={faUser} size="sm" color="#ff700c" className={'flex-shrink-0 w-3.5'} />
                                <span className="font-medium">Profile</span>
                            </button>
                            {userData?.is_superuser === true && !location.pathname.includes('admin') &&
                            <button
                                onClick={() => {
                                    navigate('/admin')
                                    setDrop(!drop)
                                }} 
                                className="w-full text-left cursor-pointer hover:bg-blue-50 active:bg-blue-100 block px-3 py-1.5 text-xs sm:text-sm text-gray-700 flex items-center gap-2 transition-colors duration-150"
                                role="menuitem" 
                                tabIndex="-1"
                                id="menu-item-2"
                            >
                                <FontAwesomeIcon icon={faUserSecret} size="sm" color="#ff700c" className={'flex-shrink-0 w-3.5'} />
                                <span className="font-medium">Go to Admin</span>
                            </button>}
                            {location.pathname.includes('admin') && 
                            <button
                                onClick={() => {
                                    navigate('/')
                                    setDrop(!drop)
                                }} 
                                className="w-full text-left cursor-pointer hover:bg-blue-50 active:bg-blue-100 block px-3 py-1.5 text-xs sm:text-sm text-gray-700 flex items-center gap-2 transition-colors duration-150"
                                role="menuitem" 
                                tabIndex="-1"
                                id="menu-item-3"
                            >
                                <FontAwesomeIcon icon={faHouse} size="sm" color="#ff700c" className={'flex-shrink-0 w-3.5'} />
                                <span className="font-medium">Go to Web</span>
                            </button>}
                            <div className="border-t border-blue-100 my-0.5"></div>
                            <button
                                onClick={handleLogout}
                                className="w-full text-left cursor-pointer hover:bg-orange-50 active:bg-orange-100 block px-3 py-1.5 text-xs sm:text-sm text-[#ff700c] flex items-center gap-2 transition-colors duration-150"
                                role="menuitem" 
                                tabIndex="-1"
                                id="menu-item-4"
                            >
                                <FontAwesomeIcon icon={faSignOut} size="sm" color="#ff700c" className={'flex-shrink-0 w-3.5'} />
                                <span className="font-medium">Sign Out</span>
                            </button>
                        </div>
                    </div>}
                </div>
            }
        </div>

    )
}

export default Header