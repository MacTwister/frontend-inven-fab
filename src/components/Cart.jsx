import { Fragment, useState, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import QRCode from 'qrcode.react';
import { apiService } from '../services/apiService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'
import { faClose } from '@fortawesome/free-solid-svg-icons'
import { faCirclePlus } from '@fortawesome/free-solid-svg-icons'
import { faCircleMinus } from '@fortawesome/free-solid-svg-icons';

export const Cart = ({ cartItems, removeFromCart, updateQuantity, isCartModalOpen, toggleCartModal, clearCart, code, codeTitle }) => {
    const [totalCost, setTotalCost] = useState(0);
    const [formData, setFormData] = useState({
        workshopTitle: codeTitle,
        name: '',
        email: ''
    });
    const [isFormComplete, setIsFormComplete] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        // Calcular el costo total
        const total = cartItems.reduce((sum, item) => sum + parseFloat(item.Price.replace(/[$,]/g, '')) * item.quantity, 0);
        setTotalCost(total);
    }, [cartItems]);

    useEffect(() => {
        setFormData({
            ...formData,
            workshopTitle: codeTitle,
        });
    }, [codeTitle]);

    useEffect(() => {
        // Verificar si todos los campos del formulario están llenos
        setIsFormComplete(
            formData.workshopTitle !== '' &&
            formData.name !== '' &&
            validateEmail(formData.email)
        );
    }, [formData]);


    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    };

    // Preparar los datos para el código QR
    const qrData = JSON.stringify({
        items: cartItems.map(item => ({ id: item.Item, quantity: item.quantity })),
        subtotal: totalCost.toFixed(2),
        formData: formData
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setEmailSent(false) // Ocultar el mensaje de confirmación
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            code: code,
            items: cartItems.map(item => ({
                id: item.Item,
                quantity: item.quantity
            })),
            subtotal: totalCost.toFixed(2),
            formData: formData
        };

        try {
            const response = await apiService.sendEmail(payload)
            if (response.status_code === 202) {
                console.log('Email response:', response);
                setEmailSent(true); // Actualiza el estado para mostrar el mensaje de confirmación
                // Restablecer el formulario
                setFormData({
                    workshopTitle: '',
                    name: '',
                    email: ''
                });
                clearCart();
            } else {
                console.log("Error sending email:", data);
            }

        } catch (error) {
            console.error('Error sending email:', error);
        }
    };

    if (!isCartModalOpen) return null;

    return (
        <Transition.Root show={isCartModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={toggleCartModal}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white shadow-xl">
                                        <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                                            <div className="flex items-start justify-between">
                                                <Dialog.Title className="text-lg font-medium text-gray-900">Inventory cart</Dialog.Title>
                                                <div className="ml-3 flex h-7 items-center">
                                                    <button
                                                        type="button"
                                                        className="relative -m-2 p-2 text-gray-400 hover:text-gray-500"
                                                        onClick={toggleCartModal}
                                                    >
                                                        <FontAwesomeIcon icon={faClose} color='hotpink' size="lg" />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mt-8">
                                                {cartItems.length === 0 && <p className='text-center text-1xl font-medium text-gray-900'>Your cart is empty :(</p>}
                                                <div className="flow-root">
                                                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                                                        {cartItems.map((item) => (
                                                            <li key={item.id} className="flex py-6">
                                                                <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                                    <img
                                                                        src={item.Image}
                                                                        alt={item.Item}
                                                                        className="h-full w-full object-cover object-center"
                                                                    />
                                                                </div>

                                                                <div className="ml-4 flex flex-1 flex-col">
                                                                    <div>
                                                                        <div className="flex justify-between text-base font-medium text-gray-900">
                                                                            <h3>
                                                                                <a href={item.Datasheet} target="_blank" rel="noopener noreferrer">{item.Item}</a>
                                                                            </h3>
                                                                            <p className="ml-4">{item.price}</p>
                                                                        </div>
                                                                        <p className="mt-1 text-sm text-gray-500">{item.Descripción}</p>
                                                                    </div>
                                                                    <div className="flex flex-1 items-end justify-between text-sm">

                                                                        <div className='flex'>
                                                                            <button type="button"
                                                                                onClick={() => updateQuantity(item, item.quantity - 1)}
                                                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                            >
                                                                                <FontAwesomeIcon icon={faCircleMinus} color='hotpink' size="lg" />
                                                                            </button>
                                                                            <p className="text-gray-500 px-4">Qty {item.quantity}</p>
                                                                            <button type="button"
                                                                                onClick={() => updateQuantity(item, item.quantity + 1)}
                                                                                className="font-medium text-indigo-600 hover:text-indigo-500"
                                                                            >
                                                                                <FontAwesomeIcon icon={faCirclePlus} color='hotpink' size="lg" />
                                                                            </button>

                                                                        </div>


                                                                        <div className="flex">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() => removeFromCart(item)}
                                                                                className="font-medium text-red-600 hover:text-red-500"
                                                                            >
                                                                                Remove
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="border-t border-gray-200 px-4 py-2 sm:px-6">
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <p>Total</p>
                                                <p>${totalCost.toFixed(2)}</p>
                                            </div>


                                            <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-sm">
                                                <form className="space-y-3" onSubmit={handleSubmit}>
                                                    <div>
                                                        <label htmlFor="workshopTitle" className="block text-sm font-medium  text-gray-900">
                                                            Workshop title
                                                        </label>
                                                        <div className="mt-0">
                                                            <input
                                                                id="workshopTitle"
                                                                name="workshopTitle"
                                                                type="text"
                                                                required
                                                                className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                value={formData.workshopTitle}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                                                            Name
                                                        </label>
                                                        <div className="mt-0">
                                                            <input
                                                                id="name"
                                                                name="name"
                                                                type="text"
                                                                autoComplete='name'
                                                                required
                                                                className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                value={formData.name}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                                                            Email address
                                                        </label>
                                                        <div className="mt-0">
                                                            <input
                                                                id="email"
                                                                name="email"
                                                                type="email"
                                                                autoComplete='email'
                                                                required
                                                                className="block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                                                value={formData.email}
                                                                onChange={handleChange}
                                                            />
                                                        </div>
                                                    </div>

                                                    {/* QR and Form */}
                                                    <div className="flex flex-1 items-end justify-end text-sm">
                                                        {/* <div className="h-46 w-46 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                                            <QRCode className="h-full w-full object-cover object-center" value={qrData} size={128} level="H" includeMargin={true} />
                                                        </div> */}

                                                        <div className="flex">
                                                            {isFormComplete
                                                                ?
                                                                <button type="submit" className='flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700'>Send Cart</button>
                                                                :
                                                                <button type="submit" className='flex items-center justify-center rounded-md border border-transparent bg-gray-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-gray-700' disabled>Empty cart</button>
                                                            }
                                                        </div>
                                                    </div>

                                                </form>
                                                {/* <a
                                                    href="#"
                                                    className="flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                                                >
                                                    Checkout
                                                </a> */}


                                            </div>
                                            <div className="mt-1 flex justify-center text-center text-sm text-gray-500">
                                                {emailSent && <div>Email sent successfully!</div>}
                                            </div>
                                        </div>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>

    );
};
