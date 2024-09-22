import React, { useEffect } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Success = ({
  message = '',
  failMessage = '',
  position = "bottom-right",
  autoClose = 5000,
  hideProgressBar = false,
  newestOnTop = false,
  closeOnClick = true,
  rtl = false,
  pauseOnFocusLoss = true,
  draggable = true,
  pauseOnHover = true,
  theme = "colored",
  transition = Bounce,
}) => {
  useEffect(() => {
    if (message) {
      toast.success(message, {
        position,
        autoClose,
        hideProgressBar,
        closeOnClick,
        pauseOnHover,
        draggable,
        progress: undefined,
        theme
      });
    } else if (failMessage) {
      toast.error(failMessage, {
        position,
        autoClose,
        hideProgressBar,
        closeOnClick,
        pauseOnHover,
        draggable,
        progress: undefined,
        theme
      });
    }
  }, [message, failMessage, position, autoClose, hideProgressBar, closeOnClick, pauseOnHover, draggable, theme]);

  return (
    <ToastContainer
      position={position}
      autoClose={autoClose}
      hideProgressBar={hideProgressBar}
      newestOnTop={newestOnTop}
      closeOnClick={closeOnClick}
      rtl={rtl}
      pauseOnFocusLoss={pauseOnFocusLoss}
      draggable={draggable}
      pauseOnHover={pauseOnHover}
      theme={theme}
      transition={transition}
    />
  );
};

export default Success;
