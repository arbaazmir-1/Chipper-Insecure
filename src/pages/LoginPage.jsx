import React, { useEffect, useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { Timestamp, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import tick from '../assets/lottie/tick.json';
import { useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const signUpWithEmailPassword = () => {
    setLoading(true);
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        const user = userCredential.user;
        const ref = doc(db, 'users', user.email);
        setDoc(
          ref,
          {
            name: '', // You can collect user name here if needed.
            email: user.email,
            photo: '', // You can add user photo if needed.
            lastSeen: Timestamp.now(),
            uid: user.uid,
          },
          { merge: true }
        ).then(() => {
          setSuccess(true);
          setTimeout(() => {
            setSuccess(false);
            navigate('/home');
          }, 3000);
        });
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  const signInWithEmailPassword = () => {
    setLoading(true);
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        setLoading(false);
        const user = userCredential.user;
        navigate('/home');
      })
      .catch((error) => {
        setLoading(false);
        setError(error.message);
      });
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <h1 className="text-3xl font-bold text-center font-mono mb-8">Login or Sign Up</h1>
      <div className="flex justify-center items-center mb-8">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={signUpWithEmailPassword}
        >
          Sign Up
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={signInWithEmailPassword}
        >
          Sign In
        </button>
      </div>
      {/* Success modal */}
      {success && (
        <div className="fixed z-10 inset-0 overflow-y-auto" id="modal-container">
          <div className="flex items-center justify-center h-full">
            <div className="bg-white rounded-lg p-4 w-full max-w-sm text-center">
              <div className="mb-4">
                <Lottie animationData={tick} />
              </div>
              <p className="text-lg font-medium">Success!</p>
            </div>
          </div>
        </div>
      )}
      {loading && (
        <div className="fixed z-10 inset-0 overflow-y-auto w-full">
          <div className="flex items-center justify-center h-screen">
            <div className="bg-gray-100 opacity-70 w-full h-screen rounded-lg p-4 text-center flex justify-center items-center">
              <div className="mb-4">
                <i className="fa fa-spinner fa-spin fa-3x"></i>
              </div>
              <p className="text-lg font-medium">Loading...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoginPage;
