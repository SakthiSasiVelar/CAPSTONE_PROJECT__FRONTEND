import './Register.css'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { validate } from 'email-validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { API_BASE_URL } from '../../utils/config';
import { formatErrorMessage , formatSuccessMessage } from '../../utils/responseFormatter';
import LoadingSpinner from '../Spinner/LoadingSpinner';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [name , setName] = useState('');
  const [nameError , setNameError] = useState('');
  const[confirmPassword , setConfirmPassword] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const[isConfirmPasswordVisible , setIsConfirmPasswordVisible] = useState(false);
  const [isLoading , setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleTogglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  function validateEmail(email){
     if(email.length == 0){
        setEmailError('Email is required')
        return false;
     }
     else if(!validate(email)){
        setEmailError('Please enter valid email')
        return false;
     }
     else{
        setEmailError('')
        return true;
     }
  }

  function validateName(name){
    if(name.length == 0){
       setNameError('Name is required')
       return false;
    }
    else{
       setNameError('')
       return true;
    }
  }

  function validatePassword(password){
    if(password.length == 0){
       setPasswordError('Password is required')
       return false;
    }
    else if(password.length < 6){
       setPasswordError('Password must be at least 6 characters long')
       return false;
    }
    else{
       setPasswordError('')
       return true;
    }
  }

  function validateConfirmPassword(confirmPassword , password){
    if(confirmPassword.length == 0){
       setConfirmPasswordError('Confirm Password is required')
       return false;
    }
    else if(confirmPassword!== password){
       setConfirmPasswordError('Passwords do not match')
       return false;
    }
    else{
       setConfirmPasswordError('')
       return true;
    }
  }

  function resetForm(){
    setEmail('');
    setPassword('');
    setName('');
    setConfirmPassword('');
  }

  const isValidSignUpDetails = () =>{
    const isValidEmailField = validateEmail(email);
    const isValidPasswordField = validatePassword(password);
    const isValidConfirmPasswordField = validateConfirmPassword(confirmPassword , password);
    const isValidNameField = validateName(name);

    return isValidEmailField && isValidNameField && isValidConfirmPasswordField && isValidPasswordField;
  }

  const registerUser = async(signUpDetails) => {
       try
       {
            const response = await fetch(API_BASE_URL +'user/register' , {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signUpDetails)
            });
            const result = await response.json(); 
            if(result.status === 'success'){
                return formatSuccessMessage(201 , 'Registered  successfully' , result.data);
            }
            else if(result.status === 'error'){
                const errorCode = result.statusCode;
                switch(errorCode){
                    case 400:
                        return formatErrorMessage(400 ,'Please check the input and try again');  
                    case 409 :             
                         return formatErrorMessage(409 , 'Email Already Taken')  
                    case 500:
                        return formatErrorMessage(500 , 'Register failed.Please try again');
                    default:
                        return formatErrorMessage(errorCode ,result.message);
                }
            }
        }
        catch(error){
            return error;
        }
    }


  const handleSignUp = async() => {
       if(isValidSignUpDetails()){
        setIsLoading(true);
        let signUpDetails = {
            name: name,
            email: email,
            password: password
        };
        try{
            const result = await registerUser(signUpDetails);
            setIsLoading(false);
           if(result.status === 'success'){              
                toast.success("Register successful!");
                setTimeout(()=>{
                    navigate("/Login")
                },500)
            }
            else if(result.status === 'error'){
                toast.error(result.message);
            }
            resetForm();
        }
        catch(error){
           setIsLoading(false);
            toast.error("Failed to SignUp.Please Try again");
            resetForm();
        }

       }
  };

  function capitalizeFirstLetter(string) {
    if (!string) return string; 
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  const handleNameChange = (e)=>{
    setName(capitalizeFirstLetter(e.target.value))
  }

  const handleConfirmPasswordChange = (e)=>{
    setConfirmPassword(e.target.value)
  }

  const handleToggleConfirmPasswordVisibility =() =>{
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
  }

  return (
    <div className="register-outer-container">
      {isLoading && <LoadingSpinner />}
      <div className="register-container">
        <div className="register-heading">SignUp</div>
        <div className="name-container">
          <input type="text" placeholder="Name" value={name} onChange={handleNameChange} />
          {nameError && <div className="error-container">{nameError}</div>}
        </div>
        <div className="email-container">
          <input type="email" placeholder="Email" value={email} onChange={handleEmailChange} />
          {emailError && <div className="error-container">{emailError}</div>}
        </div>
        <div className="password-container">
          <input type={isPasswordVisible ? "text" : "password"} placeholder="Password" value={password} onChange={handlePasswordChange} />
          {isPasswordVisible ? (
            <FaEyeSlash className='toggle-password' onClick={handleTogglePasswordVisibility} />
          ) : (
            <FaEye className="toggle-password" onClick={handleTogglePasswordVisibility} />
          )}
          {passwordError && <div className="error-container">{passwordError}</div>}
        </div>
        <div className="confirm-password-container">
          <input type={isConfirmPasswordVisible ? "text" : "password"} placeholder="Confirm Password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
         {isConfirmPasswordVisible ? (
            <FaEyeSlash className='toggle-password' onClick={handleToggleConfirmPasswordVisibility} />
          ) : (
            <FaEye className="toggle-password" onClick={handleToggleConfirmPasswordVisibility} />
          )}
          {confirmPasswordError && <div className="error-container">{confirmPasswordError}</div>}
        </div>
        <div className="register-btn" onClick={handleSignUp}>SignUp</div>
        <div>
          Already have an account? <Link to="/login" className="login-link">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
