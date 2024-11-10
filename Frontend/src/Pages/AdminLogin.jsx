import axios from 'axios';
import React, { useState } from 'react'
import { SiTicktick } from "react-icons/si";
import { GoAlertFill } from "react-icons/go";

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [popuUp, setpopuUp] = useState(null)

    const handleOwnerLoginSubmit = async (e) => {
        e.preventDefault();
        // Handle the login logic here
        try {
            let res = await axios.post('http://localhost:3000/owner/login', { email, password }, { withCredentials: true });
            setpopuUp(true)
            console.log(res)
        } catch (error) {
            console.log(error)
            setpopuUp(false)
        }
    };
    return (
        <div className="col-lg-5 col-md-6 col-sm-8 m-sm-auto col-12 pt-4 ">

            {
                popuUp ? <div className="alert alert-success d-flex align-items-center" role="alert">
                    <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><SiTicktick className='fs-5' /></svg>
                    <div>
                        Admin Verification Successfull..
                    </div>
                </div> : popuUp == null ? '' : <div class="alert alert-danger d-flex align-items-center" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><GoAlertFill className='fs-5' /></svg>
                    <div>
                        Admin Dosen't Exist!!
                    </div>
                </div>
            }
            <h3 className="form-title">Only Admin Login</h3>
            <form onSubmit={handleOwnerLoginSubmit}>
                <div className="mb-3">
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="password"
                        className="form-control"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary w-100">Admin Login</button>
            </form>
        </div>
    )
}

export default AdminLogin