import React, { useEffect, useState } from 'react';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Signup = () => {

  const navigate = useNavigate()

  const [formdata, setFormdata] = useState({
    email: "",
    name: "",
    password: "",
    password2: "",
  })

  const [error, setError] = useState('')


  const handleOnchange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value })
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

  const { email, name, password, password2 } = formdata

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email || !name || !password || !password2) {
      setError("All fields are required")
    } else {
      console.log(formdata)
    }
    const response = await axios.post('http://localhost:8000/auth/register/', formdata)
    console.log(response.data)
    const result = response.data
    if (response.status === 201) {
      navigate("/otp/verify")
      toast.success(result.message)
    }
  }


  return (
    <div>
      <div className='form-container'>
        <div style={{ width: "100%" }} className='wrapper'>
          <h2>Create Account</h2>
          <form action="" onSubmit={handleSubmit}>
            <p style={{ color: "red", padding: "1px" }}>{error ? error : ""}</p>
            <div className='form-group'>
              <label htmlFor="">Email Address</label>
              <input type="text"
                className='email-form'
                name="email"
                value={email}
                onChange={handleOnchange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor="">Name</label>
              <input type="text"
                className='email-form'
                name="name"
                value={name}
                onChange={handleOnchange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor="">Password</label>
              <input type="password"
                className='email-form'
                name="password"
                value={password}
                onChange={handleOnchange}
              />
            </div>
            <div className='form-group'>
              <label htmlFor="">Confirm password</label>
              <input type="password"
                className='email-form'
                name="password2"
                value={password2}
                onChange={handleOnchange}
              />
            </div>
            <input type="submit" value="Submit" className="submitButton" />
          </form>

          <h3 className='text-option'>Or</h3>
          <div className='githubContainer'>
            <button>Sign up with Github</button>
          </div>
          <div className='googleContainer' id="signInDiv">
            <button>Sign up with Google</button>
          </div>

        </div>
      </div>
    </div>

  )
}

export default Signup;