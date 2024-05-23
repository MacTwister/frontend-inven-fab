import { useState, useEffect } from 'react'
import styles from "./style";
import fabLogo from './assets/Fab24_WhiteLogo.png'
// import './App.css'
import { Navbar } from './components/Navbar'
import { Inventary } from './components/Inventary'
import { Cart } from './components/Cart'

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [showScroll, setShowScroll] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const toggleCartModal = () => setIsCartModalOpen(!isCartModalOpen);

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [showScroll]);

  const addToCart = (item) => {
    const existingItem = cartItems.find((cartItem) => cartItem.id === item.id);
    if (existingItem) {
      setCartItems(cartItems.map((cartItem) =>
        cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
      ));
    } else {
      setCartItems([...cartItems, { ...item, quantity: 1 }]);
    }
  };

  const removeFromCart = (item) => {
    setCartItems(cartItems.filter((cartItem) => cartItem.id !== item.id));
  };

  const updateQuantity = (item, quantity) => {
    // if quantity is 0, remove the item from the cart. Max quantity is 10
    if (quantity === 0) {
      removeFromCart(item);
      return;
    }
    if (quantity > 10) {
      quantity = 10;
    }
    setCartItems(cartItems.map((cartItem) => cartItem.id === item.id ? { ...cartItem, quantity } : cartItem));
  };


  const checkScrollTop = () => {
    if (!showScroll && window.scrollY > 400) {
      setShowScroll(true);
    } else if (showScroll && window.scrollY <= 400) {
      setShowScroll(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // para un desplazamiento suave
    });
  };

  return (
    <>
      <div className='bg-primary w-full overflow-hidden'>
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className='{`${styles.boxWidth}`}'>
            <Navbar cartItems={cartItems} toggleCartModal={toggleCartModal} />
          </div>
        </div>

        <div className='pt-20'>
          <div className={`${styles.boxWidth}`}>
            <h1 className={`${styles.heading2} text-center`}>Inventory</h1>
          </div>
        </div>

        <main>
          <Cart
            isCartModalOpen={isCartModalOpen}
            toggleCartModal={toggleCartModal}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
          />
          <Inventary addToCart={addToCart} />
        </main>

        {showScroll &&
          <button
            className="fixed bottom-4 right-4 z-10 p-4 bg-blue-700 text-white rounded-full shadow-lg"
            onClick={scrollToTop}
          >
            ↑ Top
          </button>
        }
      </div>
    </>
  )
}

export default App
