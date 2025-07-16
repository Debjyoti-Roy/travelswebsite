import { FaFingerprint } from "react-icons/fa";
import { Box, Modal } from "@mui/material";
import { FiPhone } from "react-icons/fi";
import google from "./../assets/google.png"

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const LoginModal = ({ showModal, handleClose, login, handleGoogleLogin, error2, phoneNumberChange, phone, handleChange }) => {


  return (
    <Modal
      open={showModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div className="moadalHeader">
          <div className="modalHeader-text">
            <h1 className="text-2xl text-semibold text-white">Welcome</h1>
            <p className="text-white">Sign in to continue</p>
          </div>
        </div>
        {login === "login" && (
          <div className="ModalContent">
            <div className="ModalContentText">
              <div className="content h-[50%]">
                <FaFingerprint className="finger" />

                <h3>One Click Google sign in</h3>
                <span>Sign in securely with google</span>
              </div>
              <button
                className="googleButton bg-[#fff] w-[80%]"
                onClick={handleGoogleLogin}
              >
                <div className="googlediv">
                  <img src={google} className="GoogleImage" alt="google" />
                  <p className="text-[#555}">Sign in with Google</p>
                </div>
              </button>
            </div>
          </div>
        )}
        {login === "phone" && (
          <div className="ModalContent">
            <div className="ModalContentText">
              <div className="content h-full">
                {/* <FaFingerprint className="finger" /> */}
                <FiPhone className="finger" />

                <h3>Please enter yor Phone Number for future reference</h3>
                <div className="flex flex-col gap-[5px] w-[80%]">
                  <div className="flex flex-col  w-full">
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => handleChange(e)}
                      placeholder="Phone Number"
                      className={`border p-2 rounded focus:outline-none ${error2 ? "border-red-500" : "border-gray-300"
                        }`}
                    />
                    {error2 && (
                      <span className="text-red-500 text-sm mt-1">
                        Please enter a valid 10-digit phone number
                      </span>
                    )}
                  </div>
                  <div className="flex gap-[5px] w-full">
                    <button
                      className="googleButton bg-[#2589f3] w-1/2"
                      onClick={() => {
                        phoneNumberChange("");
                      }}
                    >
                      <div className="googlediv">
                        <p className="text-white">Skip</p>
                      </div>
                    </button>
                    <button
                      className="googleButton bg-[#fff] w-1/2"
                      onClick={() => {
                        phoneNumberChange(phone);
                      }}
                    >
                      <div className="googlediv">
                        <p className="text-[#555]">Submit</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Box>
    </Modal>
  );
};

export default LoginModal;
