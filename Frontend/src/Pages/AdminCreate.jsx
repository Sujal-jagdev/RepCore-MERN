import axios from 'axios';
import React, { useState } from 'react'
import { SiTicktick } from "react-icons/si";
import { GoAlertFill } from "react-icons/go";
import { useNavigate } from 'react-router-dom';
import { API } from '../Contexts/AllContext'

const AdminLogin = () => {
    const [fullname, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [popuUp, setpopuUp] = useState(null)
    const navigate = useNavigate()

    const handleOwnerLoginSubmit = async (e) => {
        e.preventDefault();
        // Handle the login logic here
        try {
            let res = await axios.post(`${API}/owner/create`, { fullname, email, password }, {withCredentials: true});
            setpopuUp(true)
            navigate("/adminpanel")
        } catch (error) {
            console.log(error)
            setpopuUp(false)
            navigate("/")
        }
    };
    return (
        <div className="col-lg-5 col-md-6 col-sm-8 m-sm-auto col-12 pt-4">

            {
                popuUp ? <div className="alert alert-success d-flex align-items-center" role="alert">
                    <svg className="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><SiTicktick className='fs-5' /></svg>
                    <div>
                        Now You Are The Admin Of RepCore...
                    </div>
                </div> : popuUp == null ? '' : <div class="alert alert-danger d-flex align-items-center" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><GoAlertFill className='fs-5' /></svg>
                    <div>
                        Admin Already exist!!
                    </div>
                </div>
            }
            <h3 className="form-title mt-5">Only Admin Create</h3>
            <form onSubmit={handleOwnerLoginSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Fullname"
                        value={fullname}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                </div>
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
                <button type="submit" className="btn btn-primary w-100">Create</button>
            </form>
        </div>
    )
}

export default AdminLogin