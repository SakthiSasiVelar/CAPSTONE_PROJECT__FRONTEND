
import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
import './NavBarForCheckout.css';
import Logo from '../../assets/Logo/logo.png'

const NavBarForCheckout = () => {

  return (
    <div className="outer-container">
       <Link to="/cart" className='link'>
        <div className='back-to-cart-container'>
            <IoMdArrowRoundBack />
            <div className='back-to-cart-label'>Back to Cart</div>
        </div>
       </Link>
      <Link to="/">
        <img src={Logo} className='logo' alt="Logo" />
      </Link>
      <div>Secure Checkout</div>
      
    </div>
  );
};

export default NavBarForCheckout;