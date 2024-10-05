import { useState } from "react";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { FiPhone, FiMail, FiMapPin } from "../assets/icons/vander";
import axiosInstance from "../api/axios";
import { Link } from "react-router-dom";
import { Context } from "../context/context.provider";

export default function Partner() {

    const { userAuthenticated, showAuthModal } = Context();

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        address: "",
        contact_no: "",
        whatsapp_no: "",
        email: "",
      });
  const [responseMessage, setResponseMessage] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Send the form data to your API endpoint
      await axiosInstance.post("/profiles/", formData);
      setResponseMessage("Your application has been submitted successfully!");
      // Reset form fields
      setFormData({
        first_name: "",
        last_name: "",
        address: "",
        contact_no: "",
        whatsapp_no: "",
        email: "",
      });
    } catch (error) {
      setResponseMessage(
        "There was an error submitting your application. Please try again."
      );
    }
  };

  return (
    <>
      <Navbar
        navclass="defaultscroll is-sticky"
        navlight={false}
        manuclass="justify-end"
      />
      <section className="relative table w-full py-32 lg:py-40 bg-gray-50 dark:bg-slate-800">
        <div className="container relative">
          <div className="grid grid-cols-1 text-center mt-10">
            <h3 className="text-3xl leading-normal font-semibold">
              Become a Partner
            </h3>
            <h4 className="text-2xl leading-normal font-semibold text-slate-400">
                Earn commision on every booking
            </h4>
          </div>
        </div>
      </section>
      <section className="relative lg:py-24 py-16">
        <div className="container">
          <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
            <div className="md:col-span-12">
              <div className="lg:ms-5">
                <div className="bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-800 p-6">
                  <h3 className="mb-6 text-2xl leading-normal font-semibold">
                    Fill in the details to become a partner of BlueDive Konkan Wonders
                  </h3>
                  {responseMessage && (
                    <p className="mb-4 text-center text-red-500">
                      {responseMessage}
                    </p>
                  )}
                  <form onSubmit={handleSubmit}>
                    <div className="grid lg:grid-cols-12 grid-cols-1 gap-3">
                      <div className="lg:col-span-6">
                        <label htmlFor="first_name" className="font-semibold">
                          First Name:
                        </label>
                        <input
                          name="first_name"
                          id="first_name"
                          type="text"
                          value={formData.first_name}
                          onChange={handleChange}
                          className="mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="First Name"
                          required
                        />
                      </div>

                      <div className="lg:col-span-6">
                        <label htmlFor="last_name" className="font-semibold">
                          Last Name:
                        </label>
                        <input
                          name="last_name"
                          id="last_name"
                          type="text"
                          value={formData.last_name}
                          onChange={handleChange}
                          className="mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="Last Name"
                          required
                        />
                      </div>

                      <div className="lg:col-span-12">
                        <label htmlFor="address" className="font-semibold">
                          Address:
                        </label>
                        <textarea
                          name="address"
                          id="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="mt-2 w-full py-2 px-3 h-28 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="Your Address"
                          required
                        ></textarea>
                      </div>

                      <div className="lg:col-span-6">
                        <label htmlFor="contact_no" className="font-semibold">
                          Contact No:
                        </label>
                        <input
                          name="contact_no"
                          id="contact_no"
                          type="text"
                          value={formData.contact_no}
                          onChange={handleChange}
                          className="mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="Contact No"
                          required
                        />
                      </div>

                      <div className="lg:col-span-6">
                        <label htmlFor="whatsapp_no" className="font-semibold">
                          WhatsApp No:
                        </label>
                        <input
                          name="whatsapp_no"
                          id="whatsapp_no"
                          type="text"
                          value={formData.whatsapp_no}
                          onChange={handleChange}
                          className="mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="WhatsApp No"
                          required
                        />
                      </div>

                      <div className="lg:col-span-12">
                        <label htmlFor="email" className="font-semibold">
                          Email:
                        </label>
                        <input
                          name="email"
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="Email"
                          required
                        />
                      </div>
                    </div>
                    <button
                      onClick={userAuthenticated ? handleSubmit : showAuthModal}
                      id="submit"
                      name="send"
                      className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md mt-2"
                    >
                      Submit Application
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container lg:mt-24 mt-16">
                    <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-6">
                        <div className="text-center px-6">
                            <div className="relative text-transparent">
                                <div className="size-20 bg-red-500/5 text-red-500 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800">
                                    <FiPhone />
                                </div>
                            </div>

                            <div className="content mt-7">
                                <h5 className="h5 text-lg font-semibold">Phone</h5>
                                {/* <p className="text-slate-400 mt-3">The phrasal sequence of the is now so that many campaign and benefit</p> */}

                                <div className="mt-5">
                                    <Link to="tel:+918668904446" className="text-red-500 font-medium">+91 866-890-4446</Link>
                                </div>
                            </div>
                        </div>

                        <div className="text-center px-6">
                            <div className="relative text-transparent">
                                <div className="size-20 bg-red-500/5 text-red-500 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800">
                                    <FiMail />
                                </div>
                            </div>

                            <div className="content mt-7">
                                <h5 className="h5 text-lg font-semibold">Email</h5>
                                {/* <p className="text-slate-400 mt-3">The phrasal sequence of the is now so that many campaign and benefit</p> */}

                                <div className="mt-5">
                                    <Link to="mailto:contact@bluedive.com" className="text-red-500 font-medium">contact@bluedive.in</Link>
                                </div>
                            </div>
                        </div>

                        <div className="text-center px-6">
                            <div className="relative text-transparent">
                                <div className="size-20 bg-red-500/5 text-red-500 rounded-xl text-2xl flex align-middle justify-center items-center mx-auto shadow-sm dark:shadow-gray-800">
                                    <FiMapPin />
                                </div>
                            </div>

                            <div className="content mt-7">
                                <h5 className="h5 text-lg font-semibold">Location</h5>
                                {/* <p className="text-slate-400 mt-3">The phrasal sequence of the is now so that many campaign and benefit</p> */}

                                <div className="mt-5">
                                    <Link to="#" className="text-red-500 font-medium">Pune-411019, Maharashtra, India</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
      </section>
      <Footer />
    </>
  );
}
