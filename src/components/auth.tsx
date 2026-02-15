import { Link } from "react-router-dom";
import logo from "../assets/images/logo-icon.png";
import { Context } from "../context/context.provider";
import { Modal, Input, message } from "antd";
import { useState } from "react";
import { IAuthResponse } from "../types/user.types";
import axios from "../api/axios";

export default function Auth() {
  const { signInUser, hideAuthModal, authModalOpen } = Context();
  const [otpSent, setOtpSent] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  const sendOtp = async () => {
    try {
      const response = await axios.post("/send-otp/", { phone: "+91"+phoneNumber });
  
      if (response.status === 200) {
        setOtpSent(true);
        message.success(response.data.message);
      } else {
        console.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
    }
  };
  
  const verifyOtp = async () => {
    try {
      const response = await axios.post("/verify-otp/", {
        phone: "+91"+phoneNumber,
        otp,
      });
  
      if (response.status === 200) {
        const authData: IAuthResponse = response.data;
        signInUser(authData);
        hideAuthModal();
      } else {
        message.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
    }
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  return (
    <Modal
      open={authModalOpen}
      onCancel={hideAuthModal}
      closeIcon={null}
      footer={null}
      width={360}
      styles={{
        content: {
          padding: "0px 0px",
          borderRadius: "16px",
        },
      }}
    >
      <section className="flex items-center ">
        <div className="w-full relative z-3">
          <div className="flex justify-center">
            <div className="max-w-[400px] w-full p-6 bg-white dark:bg-slate-900 shadow-md dark:shadow-gray-700 rounded-md">
              <Link to="/">
                <img src={logo} className="mx-auto" alt="BlueDive" />
              </Link>
              <h5 className="my-2 text-xl font-semibold">
                {otpSent ? "Enter OTP" : "Phone Number"}
              </h5>
              <div>
                {!otpSent ? (
                  <div className="mb-4">
                    <Input
                      id="PhoneNumber"
                      size="large"
                      addonBefore="+91"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="mt-3 w-full h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded"
                      placeholder="Enter phone number"
                      required
                    />
                  </div>
                ) : (
                    <div className="mb-4">
                    <Input.OTP
                      length={6}
                      value={otp}
                      onChange={handleOtpChange}
                      className="w-full mt-3"
                    />
                  </div>
                  
                )}

                <div>
                  <button
                    type="submit"
                    className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md w-full"
                    onClick={otpSent ? verifyOtp : sendOtp}
                  >
                    {!otpSent ? "SEND OTP" : "VERIFY"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Modal>
  );
}
