import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const Signup = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [firstName, setFirstName] = useState<string>("");
    const [lastName, setLastName] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [position, setPosition] = useState<string>('');

    const signUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!firstName) {
            window.alert('Please enter a first name');
            return;
        } 
        if (!lastName) {
            window.alert('Please enter a last name');
            return;
        }

        if (!email) {
            window.alert('Please enter an email');
            return;
        }

        if (!password) {
            window.alert('Please enter a password');
            return;
        } else if (password.length < 6) {
            window.alert('Password must be at least 6 characters');
            return;

        } else {
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await sendEmailVerification(userCredential.user);
        
                const uid = userCredential.user.uid;
                const docRef = doc(db, 'users', uid);
                await setDoc(docRef, {
                    email: email,
                    firstName: firstName,
                    lastName: lastName,
                    position: position,
                });
        
                await updateProfile(userCredential.user, {
                    displayName: firstName
                });
        
                navigate('/');
            } catch (error: unknown) {
                if (error instanceof Error) {
                    window.alert(error.message);
                } else {
                    window.alert('An unknown error occurred');
                }
            }
        }
    }
    return (
        <div>
            <form className='flex flex-col' onSubmit={signUp}>
                <div>
                    <h1>Create an Account</h1>
                </div>
                
                <div>
                    <label htmlFor="email">First Name</label>
                    <input
                        type="text"
                        placeholder="First Name"
                        id="email"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="email">Last Name</label>
                    <input
                        type="text"
                        placeholder="Last Name"
                        id="email"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>

                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </div>

                <div>
                    <label className='createAccountLabel'>Position</label>
                    <select
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        required
                    >
                        <option value="" disabled>
                            Select Position
                        </option>
                        <option value="Doctor">Doctor</option>
                        <option value="Nurse">Nurse</option>
                        <option value="Patient">Patient</option>
                    </select>
                </div>

                <button className='hover:text-green-500' type="submit">Submit</button>
            </form>
        </div>
    );
}

export default Signup;