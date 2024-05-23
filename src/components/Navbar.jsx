import React from 'react';
import fabLogo from '../assets/Fab24_WhiteLogo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faShoppingCart } from '@fortawesome/free-solid-svg-icons'

export const Navbar = ({ cartItems, toggleCartModal }) => {
    return (
        <nav className="bg-white dark:bg-gray-900 fixed w-full z-10 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
            <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={fabLogo} className="w-10 h-10" alt="Flowbite logo" />
                    <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Fab24</span>
                </a>
                <div className="flex md:order-2 space-x-3 md:space-x-3 rtl:space-x-reverse ">
                    <button onClick={toggleCartModal} type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-6 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">

                        <FontAwesomeIcon icon={faShoppingCart} color='white' size="lg" />
                        {cartItems.length > 0 && (
                            <span className="badge text-white pl-1">( {cartItems.length} )</span>
                        )}
                    </button>

                </div>
            </div>
        </nav>
    )
}