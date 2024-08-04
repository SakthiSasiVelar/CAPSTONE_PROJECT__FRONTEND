import './Footer.css'
const Footer = () =>{
    return(
      <footer className="footer">
        <div className="footer-container">
            <div className='footer-top'>
                <div>FREE RETURNS WITHIN 30 DAYS </div>
                <div>.</div>
                <div>FREE DELIVERY ON ORDERS ABOVE Rs.999</div>
            </div>
            <div className="footer-row">
                <div className="footer-column">
                    <h3>About Us</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam scelerisque.</p>
                </div>
                <div className="footer-column">
                    <h3>Contact</h3>
                    <p>Email: contact@example.com</p>
                    <p>Phone: +123 456 7890</p>
                </div>
                <div className="footer-column">
                    <h3>Follow Us</h3>
                    <ul className="social-links">
                        <li><a href="#">Facebook</a></li>
                        <li><a href="#">Twitter</a></li>
                        <li><a href="#">Instagram</a></li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; <span>2024</span> Sakthi Sasi Velar. All rights reserved.</p>
            </div>
        </div>
    </footer>
    )
}

export default Footer;