import {useState} from 'react';
import { auth} from "../../config/firebase";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import Signup from '../../components/Signup/Signup';

const Login = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const signIn = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            console.log(userCredential);
            navigate('/');
        })
        .catch((error) => {
            alert("Login Error");
            console.log(error);
        });
    };

    return (
        <div className='flex justify-evenly'>
            <div>
                <form onSubmit={signIn}>
                    <div>
                        <h1>Log In</h1>
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            placeholder="Email"
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            placeholder='Password'
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>

            <div>
                <Signup />
            </div>
        </div>
    );
}

export default Login;