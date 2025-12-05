import React from "react";
import BackgroundImage from '../assets/footer/footer-bg.png'
import {FaXTwitter} from "react-icons/fa6";
import {useNavigate} from "react-router-dom";

const Footer = () => {
    const navigate = useNavigate()
    return (
        <footer className="bg-blue-950 w-full mt-16 border-t border-blue-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
                
                {/* Top Section with Logo and Social */}
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-6 lg:gap-8 pb-2 sm:pb-0border-b border-blue-900">
                    {/* Logo Section */}
                    {/* <div className="flex justify-center lg:justify-start">
                        <img 
                            src={FooterLogo} 
                            alt="X Finance Bull Logo" 
                            className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto object-contain transition-opacity duration-200 hover:opacity-90"
                        />
                    </div> */}
                                        {/* Links Section */}
                    <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs sm:text-sm">
                        <button 
                            className="text-white hover:text-gray-200 transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-950 rounded px-1 py-0.5"
                            onClick={() => navigate('/terms-and-services')}
                            aria-label="Terms of Service"
                        >
                            Terms of Service
                        </button>
                        <button 
                            className="text-white hover:text-gray-200 transition-colors duration-200 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 focus:ring-offset-blue-950 rounded px-1 py-0.5"
                            onClick={() => navigate('/privacy-policy')}
                            aria-label="Privacy Policy"
                        >
                            Privacy Policy
                        </button>
                    </div>
                    
                    
                    {/* Social Media Section */}
                    <div className="flex flex-col sm:flex-row justify-center lg:justify-end items-center gap-1">
                        <p className="text-white text-sm sm:text-base font-medium">
                            Contact us through
                        </p>
                        <a 
                            href='https://x.com/Xfinancebull' 
                            target='_blank' 
                            rel="noopener noreferrer"
                            className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full hover:bg-blue-800 transition-all duration-200 hover:scale-105 active:scale-95"
                            aria-label="Follow us on X (Twitter)"
                        >
                            <FaXTwitter className="text-white hover:text-gray-200 text-lg sm:text-lg transition-colors duration-200"/>
                        </a>
                    </div>
                </div>

                {/* Bottom Section with Copyright and Links */}
                <div className="flex justify-center sm:flex-row items-center gap-4 sm:gap-6 mb-2">
                    {/* Copyright Text */}
                    <p className="text-white text-xs sm:text-sm text-center sm:text-left order-2 sm:order-1">
                        © {new Date().getFullYear()} X Finance Bull. All Rights Reserved
                    </p>


                </div>
            </div>
        </footer>
    );
};

export default Footer;
