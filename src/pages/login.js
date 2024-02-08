// pages/login.js
import { useRouter } from 'next/router';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
// import { providers } from 'next-auth';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
        const response = await axios.post('reson/user_accounts/login', {
            email: email,
            password: password
        });

        if (response.data.status === 'true') {
          toast.success('Successfully signed in', {
            onClose: () => {
              location.reload();
            },
          });
            router.push('/home');
        } else {
            console.log('Invalid email or password');
            alert('Invalid email or password')
        }
    } catch (error) {
        console.error('Error logging in:', error);
        alert('Invalid email or password')
    }
};

  const SignUp = () => {
    router.push('/signup');
  };

  return (
    <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/*OG TAG */}
        <meta property="og:title" content="Reason " />
        <meta property="og:type" content="Application" />
        <meta property="og:image" content="img/reson_Logo.svg" />
        <meta property="og:url" content='' />
        <meta property="og:description" content='' />
        <meta name="description" content='' />
        <meta name="keywords" content='' />
        <meta name="author" content="ekavarna" />
        {/* Google Font*/}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&family=Roboto:wght@100;300;400;500;700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:opsz,wght@16..144,100;16..144,200;16..144,300;16..144,400;16..144,500;16..144,600&family=Noto+Sans:wght@300&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:opsz,wght@16..144,100;16..144,200;16..144,300;16..144,400;16..144,500;16..144,600&family=Noto+Sans:wght@300&family=Public+Sans:wght@100;200;300;400&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
        {/*Link */}
        <link rel="shortcut icon" href="./public/img/reson_Logo.svg" />
        <link rel="apple-touch-icon" href="/img/reson_Logo.svg" />
        <link rel="stylesheet" href="./css/bootstrap.min.css" />
        <link rel="stylesheet" href="./css/style.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css" />
        {/*Title */}
        <title>Reson SignIn </title>
        <div className="row">
          {/* Left Pannel*/}
          <div className="col-lg-5 d-flex align-items-center justify-content-center sign-in-left-pannel-container ">
            {/* Header Logo*/}
            <div className="col">
              <div className="row mb-2">
                <div className="col text-center">
                  <img className="header-logo " src="/img/reson_Logo.svg" alt="Logo" />
                </div>
              </div>
              {/* Form */}
              <div className="Login-form">
                {/* main form */}
                <form onSubmit={(e) => {
  e.preventDefault(); // Prevents the default form submission behavior
  handleLogin(); // Calls your custom signup logic
}}>
                  <h3 className="signup-subheading">Welcome Back!</h3>
                  <p className="signup-info">Please enter your details to proceed with the platform</p>
                  <label htmlFor="InputEmail">Email</label>
                  <div className="single-input">
                    <span><i className="fas fa-envelope" /></span>
                    <input 
                    type="email" 
                    id="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email" />
                  </div>
                  <label htmlFor="InputPassword">Password</label>
                  <div className="single-input">
                    <span><i className="fas fa-lock" /></span>
                    <input 
                    type="password" 
                    id="password" 
                    placeholder="***************"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="form-group form-check">
                    <input type="checkbox" className="form-check-input" id="remembercheck" />
                    <label className="form-check-label" htmlFor="remembercheck"><span className="password-info"> Remember for 30 days
                        </span></label>
                  </div>
                  <div className="single-input submit-btn">
                    <button type="submit"> Submit </button>
                  </div>
                  <button className="sign-up__social-button" style={{ marginTop: '5px'}}>
                    <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M15.8299 8.18184C15.8299 7.61456 15.779 7.06911 15.6845 6.54547H8.1499V9.64002H12.4554C12.2699 10.64 11.7063 11.4873 10.859 12.0546V14.0619H13.4445C14.9572 12.6691 15.8299 10.6182 15.8299 8.18184Z" fill="#4285F4" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M8.14959 16C10.3096 16 12.1205 15.2836 13.4442 14.0618L10.8587 12.0545C10.1423 12.5345 9.22596 12.8181 8.14959 12.8181C6.06595 12.8181 4.30231 11.4109 3.67322 9.51996H1.00049V11.5927C2.31685 14.2072 5.02232 16 8.14959 16Z" fill="#34A853" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M3.67355 9.51996C3.51355 9.03996 3.42264 8.52724 3.42264 7.99996C3.42264 7.47269 3.51355 6.95996 3.67355 6.47996V4.40723H1.00081C0.458994 5.48723 0.149902 6.70905 0.149902 7.99996C0.149902 9.29087 0.458994 10.5127 1.00081 11.5927L3.67355 9.51996Z" fill="#FBBC05" />
                      <path fillRule="evenodd" clipRule="evenodd" d="M8.14959 3.18183C9.32414 3.18183 10.3787 3.58546 11.2078 4.37819L13.5023 2.08364C12.1169 0.792729 10.306 0 8.14959 0C5.02232 0 2.31685 1.79273 1.00049 4.40728L3.67322 6.48001C4.30231 4.5891 6.06595 3.18183 8.14959 3.18183Z" fill="#EA4335" />
                    </svg>
                    <span>
                      Sign In With Google
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </div>
          {/* Right Pannel */}
          <div className="col-lg-7 d-flex align-items-center  sign-in-right-pannel-container">
            <div className="sign-in-inner text-center">
              <img className="element-right-img" src="/img/reson_mask-circle-big.svg" alt="Elements" />
              <img className="element-left-img" src="/img/reson_mask_element_left.svg" alt="Elements" />
              <img className="sign-in-inner-banner" src="/img/reson-group-of-people.png" alt="Group of people" />
              {/*- Swipper*/}
              <img className="sign-in-quote" src="/img/quote.svg" alt="Group of people" />
              <p className="sign-in-quote-text">Lorem ipsum dolor sit amet, consect adipiscing elit, sed do eiusmod tempor
                incididunt.</p>
              <p className="sign-in-quote-author">Leslie Alexander
              </p>
              <p className="sign-in-quote-designation"> YOUR DESIGNATION
              </p>
            </div>
          </div>
        </div>
      </div>
  );
}

// // pages/login.js
// import { useRouter } from 'next/router';
// import { useState } from 'react';
// import axios from 'axios';
// import { useSession, signIn } from 'next-auth/react';
// import { toast } from 'react-toastify';
// // import { providers } from 'next-auth';
// import 'bootstrap/dist/css/bootstrap.min.css';

// export default function LoginPage() {
//   const router = useRouter();
//   const { status, data: session } = useSession()

//   const handleLogin = async (event) => {
//     event.preventDefault()

//         const email = event.target.email.value;
//         const password = event.target.password.value;


//         if( email == null || email== '') {
//             toast.error('Invalid email address', { theme: 'colored' });
//             return;
//         }

//         if( password == null || password == '' ) {
//             toast.error('Invalid password', { theme: 'colored' });
//             return;
//         }
//     const submitForm = event.target.submit;
//         submitForm.innerText = 'Please wait...';
//         console.log('username and password', email, password)
//     const result = await signIn('credentials', {
//       email: email,
//       password: password,
//       callbackUrl: 'http://localhost:3000/',
//       redirect: true
//     }).then(({ok, error}) => {
//         console.log('ok', ok);
//         // console.log('error', error);
//       if(ok) {
//           toast.success('User authenticated successfully')
//       }
//       else {
//           toast.error('Invalid username or password', {theme: 'colored'})
//           submitForm.innerText = 'Sign In';
//       }
//   });
//   };


//   const SignUp = () => {
//     router.push('/signup');
//   };

//   return (
//     <div>
//         <meta charSet="UTF-8" />
//         <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         {/*OG TAG */}
//         <meta property="og:title" content="Reason " />
//         <meta property="og:type" content="Application" />
//         <meta property="og:image" content="img/reson_Logo.svg" />
//         <meta property="og:url" content='' />
//         <meta property="og:description" content='' />
//         <meta name="description" content='' />
//         <meta name="keywords" content='' />
//         <meta name="author" content="ekavarna" />
//         {/* Google Font*/}
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
//         <link href="https://fonts.googleapis.com/css2?family=Roboto+Condensed:wght@300;400;700&family=Roboto:wght@100;300;400;500;700&display=swap" rel="stylesheet" />
//         <link rel="preconnect" href="https://fonts.googleapis.com" />
//         <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
//         <link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:opsz,wght@16..144,100;16..144,200;16..144,300;16..144,400;16..144,500;16..144,600&family=Noto+Sans:wght@300&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
//         <link href="https://fonts.googleapis.com/css2?family=Montagu+Slab:opsz,wght@16..144,100;16..144,200;16..144,300;16..144,400;16..144,500;16..144,600&family=Noto+Sans:wght@300&family=Public+Sans:wght@100;200;300;400&family=Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&family=Roboto:wght@100;300;400;500;700;900&display=swap" rel="stylesheet" />
//         {/*Link */}
//         <link rel="shortcut icon" href="./public/img/reson_Logo.svg" />
//         <link rel="apple-touch-icon" href="/img/reson_Logo.svg" />
//         <link rel="stylesheet" href="./css/bootstrap.min.css" />
//         <link rel="stylesheet" href="./css/style.css" />
//         <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.2.1/css/all.min.css" />
//         <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.3.0/font/bootstrap-icons.css" />
//         {/*Title */}
//         <title>Reson SignIn </title>
//         <div className="row">
//           {/* Left Pannel*/}
//           <div className="col-lg-5 d-flex align-items-center justify-content-center sign-in-left-pannel-container ">
//             {/* Header Logo*/}
//             <div className="col">
//               <div className="row mb-2">
//                 <div className="col text-center">
//                   <img className="header-logo " src="/img/reson_Logo.svg" alt="Logo" />
//                 </div>
//               </div>
//               {/* Form */}
//               <div className="Login-form">
//                 {/* main form */}
//                 <form onSubmit={handleLogin}>
//                   <h3 className="signup-subheading">Welcome Back!</h3>
//                   <p className="signup-info">Please enter your details to proceed with the platform</p>
//                   <label htmlFor="InputEmail">Email</label>
//                   <div className="single-input">
//                     <span><i className="fas fa-envelope" /></span>
//                     <input 
//                     type="email" 
//                     id="email" 
//                     name='email'
//                     placeholder="Enter your email" />
//                   </div>
//                   <label htmlFor="InputPassword">Password</label>
//                   <div className="single-input">
//                     <span><i className="fas fa-lock" /></span>
//                     <input 
//                     type="password" 
//                     id="password" 
//                     placeholder="***************"
//                     name='password'
//                     />
//                   </div>
//                   <div className="form-group form-check">
//                     <input type="checkbox" className="form-check-input" id="remembercheck" />
//                     <label className="form-check-label" htmlFor="remembercheck"><span className="password-info"> Remember for 30 days
//                         </span></label>
//                   </div>
//                   <div className="single-input submit-btn">
//                     <button type="submit"> Submit </button>
//                   </div>
//                   <button className="sign-up__social-button" style={{ marginTop: '5px'}}>
//                     <svg width={16} height={16} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path fillRule="evenodd" clipRule="evenodd" d="M15.8299 8.18184C15.8299 7.61456 15.779 7.06911 15.6845 6.54547H8.1499V9.64002H12.4554C12.2699 10.64 11.7063 11.4873 10.859 12.0546V14.0619H13.4445C14.9572 12.6691 15.8299 10.6182 15.8299 8.18184Z" fill="#4285F4" />
//                       <path fillRule="evenodd" clipRule="evenodd" d="M8.14959 16C10.3096 16 12.1205 15.2836 13.4442 14.0618L10.8587 12.0545C10.1423 12.5345 9.22596 12.8181 8.14959 12.8181C6.06595 12.8181 4.30231 11.4109 3.67322 9.51996H1.00049V11.5927C2.31685 14.2072 5.02232 16 8.14959 16Z" fill="#34A853" />
//                       <path fillRule="evenodd" clipRule="evenodd" d="M3.67355 9.51996C3.51355 9.03996 3.42264 8.52724 3.42264 7.99996C3.42264 7.47269 3.51355 6.95996 3.67355 6.47996V4.40723H1.00081C0.458994 5.48723 0.149902 6.70905 0.149902 7.99996C0.149902 9.29087 0.458994 10.5127 1.00081 11.5927L3.67355 9.51996Z" fill="#FBBC05" />
//                       <path fillRule="evenodd" clipRule="evenodd" d="M8.14959 3.18183C9.32414 3.18183 10.3787 3.58546 11.2078 4.37819L13.5023 2.08364C12.1169 0.792729 10.306 0 8.14959 0C5.02232 0 2.31685 1.79273 1.00049 4.40728L3.67322 6.48001C4.30231 4.5891 6.06595 3.18183 8.14959 3.18183Z" fill="#EA4335" />
//                     </svg>
//                     <span>
//                       Sign In With Google
//                     </span>
//                   </button>
//                 </form>
//               </div>
//             </div>
//           </div>
//           {/* Right Pannel */}
//           <div className="col-lg-7 d-flex align-items-center  sign-in-right-pannel-container">
//             <div className="sign-in-inner text-center">
//               <img className="element-right-img" src="/img/reson_mask-circle-big.svg" alt="Elements" />
//               <img className="element-left-img" src="/img/reson_mask_element_left.svg" alt="Elements" />
//               <img className="sign-in-inner-banner" src="/img/reson-group-of-people.png" alt="Group of people" />
//               {/*- Swipper*/}
//               <img className="sign-in-quote" src="/img/quote.svg" alt="Group of people" />
//               <p className="sign-in-quote-text">Lorem ipsum dolor sit amet, consect adipiscing elit, sed do eiusmod tempor
//                 incididunt.</p>
//               <p className="sign-in-quote-author">Leslie Alexander
//               </p>
//               <p className="sign-in-quote-designation"> YOUR DESIGNATION
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// }

