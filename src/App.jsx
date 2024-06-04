import { useState, useEffect } from 'react'
import styles from "./style";
import fabLogo from './assets/Fab24_WhiteLogo.png'
// import './App.css'
import { Navbar } from './components/Navbar'
import { Inventary } from './components/Inventary'
import { Cart } from './components/Cart'
import { apiService } from './services/apiService';

function slugToTitle(slug) {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

const queryParams = new URLSearchParams(window.location.search);
const codeParam = queryParams.get('code');
const nothingParam = queryParams.get('nothingplease');

function App() {
  const [code, setCode] = useState(codeParam);
  const [codeTitle, setCodeTitle] = useState('');
  const [isCartAccessible, setIsCartAccessible] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [showScroll, setShowScroll] = useState(false);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [nothingPlease, setNothingPlease] = useState(nothingParam === '1');
  const toggleCartModal = () => setIsCartModalOpen(!isCartModalOpen);

  useEffect(() => {
    if (code) {
      // TODO: Validate the code? for now accept if provided
      setCodeTitle(slugToTitle(codeParam));
      setIsCartAccessible(true);
    }
  }, [code]);

  useEffect(() => {
    window.addEventListener('scroll', checkScrollTop);
    return () => {
      window.removeEventListener('scroll', checkScrollTop);
    };
  }, [showScroll]);

  useEffect(() => {
    if (nothingPlease) {
      setIsCartAccessible(false);
      sendNothingRequest(codeTitle);
    }
  }, [nothingPlease]);

  const sendNothingRequest = async (codeTitle) => {
    const payload = {
        items: [{
            id: 'Nothing Please',
            quantity: 1
        }],
        subtotal: (0).toFixed(2),
        formData: { workshopTitle: codeTitle, name: '', email: '' }
    };

    try {
      const response = await apiService.sendEmail(payload)
    } catch (error) {
        console.error('Error sending email:', error);
    }
  };

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

  const clearCart = () => {
    setCartItems([]);
    setState([]);
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

  if (nothingPlease) {
    return (
      <div className='bg-primary w-full overflow-hidden'>
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className='{`${styles.boxWidth}`}'>
            <Navbar isCartAccessible={isCartAccessible} cartItems={cartItems} toggleCartModal={toggleCartModal} />
          </div>
        </div>

        <div className='pt-20'>
          <div className={`max-w-md pt-8 mx-auto`}>
            <p className={`${styles.paragraph} text-center`}>
              Ok, Thank you for telling us you do not require any materials from the FAB24 Inventory. If you have any questions, contact the FAB24 team!
              <br />
              Have a magical day full of luck!
            </p>
            <img src="i-don't-need-your-help-bender.gif" alt="i-don't-need-your-help-bender" className="mt-8 mx-auto" />
            <p className={`mt-8 ${styles.paragraph} text-center`}>
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className='bg-primary w-full overflow-hidden'>
        <div className={`${styles.paddingX} ${styles.flexCenter}`}>
          <div className='{`${styles.boxWidth}`}'>
            <Navbar isCartAccessible={isCartAccessible} cartItems={cartItems} toggleCartModal={toggleCartModal} />
          </div>
        </div>

        <div className='pt-20'>
          <div className={`${styles.boxWidth} pt-8`}>
            {code ? ( 
            <p className={`${styles.paragraph} text-center`}>
              Please make a selection from our inventory your workshop <strong>"{codeTitle}"</strong>, 
              and then submit your shopping cart from the top right.
            </p>
            ) : (
            <p className={`${styles.paragraph} text-center`}>
            To request materials for your workshop, please find the unique url you recieved in an email. 
            If you experience any issues please contact the fabevent team.
            </p>
            )}
          </div>
        </div>

        <main>
          <Cart
            isCartModalOpen={isCartModalOpen}
            toggleCartModal={toggleCartModal}
            cartItems={cartItems}
            removeFromCart={removeFromCart}
            updateQuantity={updateQuantity}
            clearCart={clearCart}
            codeTitle={codeTitle}
          />
          <Inventary addToCart={addToCart} isCartAccessible={isCartAccessible} />
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
