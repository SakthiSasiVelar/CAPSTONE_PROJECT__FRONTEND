
import './Login.css';
import {useState} from 'react';
import { FaEye , FaEyeSlash } from "react-icons/fa";
import { validate } from 'email-validator';
import { API_BASE_URL } from '../../utils/config';
import { formatSuccessMessage,formatErrorMessage } from '../../utils/responseFormatter';
import { useDispatch } from 'react-redux';
import { setUserDetails } from '../../Slices/userSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../Spinner/LoadingSpinner';

const Login = ()=>{
    const [email , setEmail] = useState('');
    const [password, setPassword] = useState(''); 
    const [emailError , setEmailError] = useState('');
    const [passwordError , setPasswordError] = useState('');
    const [isPasswordVisible , setIsPasswordVisible] = useState(false);
    const [isLoading , setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate()


    const handleTogglePasswordVisiblity = ()=>{
        setIsPasswordVisible(!isPasswordVisible);
    }

    const validateEmail = (email)=>{
        if(email.length == 0){
            setEmailError("Please enter your email");
            return false;
        }   
        else if(!validate(email)){
            setEmailError("Please enter a valid email");
            return false;
        }
        else{
            setEmailError("");
            return true;
        }
    }

    const validatePassword = (password) =>{
        if(password.length == 0){
            setPasswordError("Please enter your password");
            return false;
        }
        else{
            setPasswordError("");
            return true;
        }
    }

    const isValidLoginDetails = ()=>{
        const isValidEmailField = validateEmail(email);
        const isValidPasswordField = validatePassword(password);
        return isValidEmailField && isValidPasswordField;
    }

    const handleEmailChange = (e) => {
       setEmail(e.target.value);
    }
       
    const handlePasswordChange = (e) => {
       setPassword(e.target.value);
    }

    const loginUser = async(loginDetails) => {
       try
       {
            const response = await fetch(API_BASE_URL +'user/login' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginDetails)
            });
            const result = await response.json();
            if(result.status === 'success'){
                return formatSuccessMessage(200 , 'Logged in successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');   
                    case 401:
                        return formatErrorMessage(401 ,'Invalid Email or Password');                        
                    case 500:
                        return formatErrorMessage(500 , 'Login failed.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }

    const resetForm = () => {
        setEmail('');
        setPassword('')
    }

    const handleLogin = async () =>{
        if(isValidLoginDetails()){
            setIsLoading(true);
           let loginDetails = {
            email: email,
            password: password
           }
           try{
                const result = await loginUser(loginDetails);
                setIsLoading(false);
                if(result.status === 'success'){
                    dispatch(setUserDetails(result.data));
                    toast.success("Login successful!");
                    setTimeout(()=>{
                        if(result.data.role === 'User'){
                            navigate("/");
                        }
                        else if(result.data.role === 'Admin'){
                            navigate("/AdminHome");
                        }
                    },500)
                }
                else if(result.status === 'error'){
                    toast.error(result.message);
                }
                resetForm();
           }
           catch(error){
              console.log(error);
              setIsLoading(false);
              toast.error("Login Failed.Please Try again");
              resetForm();
           }
        }
    }


    return (
        <div className="login-outer-container">
            {isLoading && <LoadingSpinner />}
        <div className="login-container">
          <div className="login-heading">Login</div>
          <div className="email-container">
            <input type="email" placeholder="Email" value={email} onChange={(e)=>handleEmailChange(e)} />
            {emailError.length > 0 && <div className="error-container">{emailError}</div> }
          </div>
          <div className="password-container">
            <input type={isPasswordVisible ? "text" : "password"} placeholder="Password" value={password} onChange={(e)=>handlePasswordChange(e)} />
           {isPasswordVisible ? <FaEyeSlash className='toggle-password' onClick={handleTogglePasswordVisiblity}/>  : <FaEye  className="toggle-password" onClick={handleTogglePasswordVisiblity} /> }
            {passwordError.length > 0 && <div className="error-container">{passwordError}</div> }
          </div>
          <a href="#" className="forgot-password-link">Forgot Password?</a>
          <div className="login-btn" onClick={handleLogin}>Login</div>
          <div>
            Dont have an account? <Link to="/signUp" className="sign-up-link">Signup</Link>
          </div>
           
        </div>
      </div>
    )
}

export default Login;