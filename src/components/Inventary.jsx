import React, { useEffect, useState } from 'react';
import { apiService } from '../services/apiService';
import { Player } from '@lottiefiles/react-lottie-player';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCartPlus } from '@fortawesome/free-solid-svg-icons'
import fabLogo from '../assets/Fab24_WhiteLogo.png'

export const Inventary = ({ addToCart, isCartAccessible }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        apiService.getInventary()
            .then((data) => {
                setData(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error al cargar los datos:', error);
                setLoading(false);
                setError(true);
            });
    }, []);

    const handleAddToCart = (item) => {
        addToCart(item);
    };

    const clearSearch = () => {
        setSearchTerm('');
    };

    const filteredData = searchTerm
        ? data.filter(item =>
            Object.values(item).some(value =>
                value && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
            )
        )
        : data;

    if (loading) {
        return <div>
            <img src={fabLogo} alt="Fab24 Logo" className="fab-logo" style={{ height: '400px', width: '400px' }}/>
            <Player
                autoplay
                loop
                src='https://lottie.host/354339e6-0eca-4993-9b13-b26ac0c43e2e/ZeJMflNZjs.json'
                className="player"
                style={{ height: '400px', width: '400px' }}
            ></Player>
            Loading inventory...</div>;
    }

    if (error) {
        return <div className="text-center text-2xl text-red-600 mt-10">"Error loading data"</div>;
    }

    return (
        <div>
            <div className="max-w-md mx-auto my-10 px-6">
                <label for="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
                <div className="relative">
                    <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                            <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                        </svg>
                    </div>
                    <input
                        type="search"
                        id="default-search"
                        className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        placeholder="Search for items..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        required
                    />
                    <button onClick={clearSearch} type="button" className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                        Clear
                    </button>
                </div>
            </div>


            {filteredData.length > 0 ? (
                <div className="container mx-auto p-1">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg rounded-md">
                        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                            <thead className="text-xs text-gray-100 uppercase bg-hotpink dark:bg-hotpink dark:text-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 uppercase font-semibold text-sm">Image</th>
                                    <th scope="col" className="px-6 py-3 uppercase font-semibold text-sm">Item</th>
                                    <th className="px-6 py-3 uppercase font-semibold text-sm">Description</th>
                                    <th className="px-6 py-3 uppercase font-semibold text-sm">Type</th>
                                    <th className="px-6 py-3 uppercase font-semibold text-sm">FabAcademy Week Inventory</th>
                                    <th className="px-6 py-3 uppercase font-semibold text-sm">More info</th>
                                    <th className="px-6 py-3 uppercase font-semibold text-sm">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700">
                                {filteredData.map((item) => (
                                    <tr key={item.id} className='odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700'>
                                        <td>
                                            <img src={item.Image} alt={item.Item} className="table-image p-1" />
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.Item}</td>
                                        <td className="px-6 py-4  text-gray-900 dark:text-gray-300">{item.Descripción}</td>
                                        <td className="px-6 py-4  text-gray-900 dark:text-gray-300">{item.Type}</td>
                                        <td className="px-6 py-4  text-gray-900 dark:text-gray-300">{item.Week}</td>
                                        <td className="px-6 py-4  text-gray-900 dark:text-gray-300">
                                            <a href={item.Datasheet} target="_blank" rel="noopener noreferrer" className='font-medium text-yellow-500 dark:text-yellow-500 hover:underline' >Datasheet</a>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isCartAccessible && (
                                            <button className="font-medium text-blue-600 dark:text-blue-500 hover:underline" onClick={() => handleAddToCart(item)}>
                                                <FontAwesomeIcon icon={faCartPlus} color='hotpink' size="lg" />
                                            </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div>No data available.</div>
            )}
        </div>
    );
};
