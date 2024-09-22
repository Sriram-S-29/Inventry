import React, { useEffect } from 'react';
import { ToastContainer, Bounce, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Error = ({ message }) => {
  useEffect(() => {
    if (message) {
      toast.error(message); // Show error toast with the given message
    }
  }, [message]); // Only run when message changes

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
      transition={Bounce}
    />
  );
};

export default Error;
