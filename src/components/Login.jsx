import React, { useEffect } from 'react';
import axios from 'axios'
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { useState } from "react";
// import AxiosInstance from "../utils/AxiosInstance";


const Login = () => {

  const navigate = useNavigate()
  const [searchparams] = useSearchParams()
  const [logindata, setLogindata] = useState({
    email: "",
    password: ""
  })
  const [isLoading, setIsLoading] = useState(false)


  const handleOnchange = (e) => {
    setLogindata({ ...logindata, [e.target.name]: e.target.value })
  }

  const handleSigninWithGoogle = async (response)=>{
    const payload=response.credential
    try {
      const server_res = await axios.post("http://localhost:8000/auth/google/", {'access_token': payload})
      console.log("Respuesta del servidor:", server_res.data);

      const user = {
        'full_name': server_res.data.full_name,
        'email': server_res.data.email
      }

      if (server_res.status === 200) {
        localStorage.setItem('token', JSON.stringify(server_res.data.access_token))
        localStorage.setItem('refresh_token', JSON.stringify(server_res.data.refresh_token))
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/dashboard')
        toast.success('Login successful')
      } else {
        toast.error('Something went wrong')
      }
    } catch (error) {
      console.error("Error al enviar la solicitud al servidor:", error);
      toast.warn(error);
      console.error("Detalles de la respuesta del servidor:", error.response.data);
    }

}

  // const handleLoginWithGithub = () => {
  //   window.location.assign(`https://github.com/login/oauth/authorize/?client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}`)
  // }

  // const send_github__code_to_server = async () => {
  //   if (searchparams) {
  //     try {
  //       const urlparam = searchparams.get('code')
  //       const resp = await AxiosInstance.post('auth/github/', { 'code': urlparam })
  //       const result = resp.data
  //       console.log('server res: ', result)
  //       if (resp.status === 200) {
  //         const user = {
  //           'email': result.email,
  //           'names': result.full_name
  //         }
  //         localStorage.setItem('token', JSON.stringify(result.access_token))
  //         localStorage.setItem('refresh_token', JSON.stringify(result.refresh_token))
  //         localStorage.setItem('user', JSON.stringify(user))
  //         navigate('/dashboard')
  //         toast.success('login successful')
  //       }
  //     } catch (error) {
  //       if (error.response) {

  //         console.log(error.response.data);
  //         toast.error(error.response.data.detail)
  //       }
  //     }
  //   }

  // }

  // let code = searchparams.get('code')
  // useEffect(() => {
  //   if (code) {
  //     send_github__code_to_server()
  //   }
  // }, [code])



  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id:import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleSigninWithGoogle
    });
    google.accounts.id.renderButton(
      document.getElementById("signInDiv"),
      {theme:"outline", size:"large", text:"continue_with", shape:"circle", width:"280"}
    );
      
  }, [])


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (logindata) {
      setIsLoading(true)
      const res = await axios.post('http://localhost:8000/auth/login/', logindata)
      const response = res.data
      setIsLoading(false)
      const user = {
        'full_name': response.full_name,
        'email': response.email
      }

      if (res.status === 200) {
        localStorage.setItem('token', JSON.stringify(response.access_token))
        localStorage.setItem('refresh_token', JSON.stringify(response.refresh_token))
        localStorage.setItem('user', JSON.stringify(user))
        navigate('/dashboard')
        toast.success('Login successful')
      } else {
        toast.error('Something went wrong')
      }
    }
  }
  
  return (
    <div>
      <div className='form-container'>
        <div style={{ width: "100%" }} className='wrapper'>
          <h2>Login into your account</h2>
          <form action="" onSubmit={handleSubmit}>
            <div className='form-group'>
              <label htmlFor="">Email Address:</label>
              <input type="text"
                className='email-form'
                value={logindata.email}
                name="email"
                onChange={handleOnchange}
                />

            </div>

            <div className='form-group'>
              <label htmlFor="">Password:</label>
              <input type="password"
                className='email-form'
                value={logindata.password}
                name="password"
                onChange={handleOnchange} 
                />
            </div>

            <input type="submit" value="Login" className="submitButton" />
            <p className='pass-link'><Link to={'/forget-password'}>forgot password</Link></p>
          </form>
          <h3 className='text-option'>Or</h3>
          <div className='githubContainer'>
            <button>Sign in with Github</button>
          </div>
          <div className='googleContainer'>
            <div id="signInDiv" className='gsignIn'></div>
          </div>
        </div>
      </div>

    </div>
  )
};

export default Login;
