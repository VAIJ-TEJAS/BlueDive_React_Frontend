import { useState } from "react";
import { Link } from "react-router-dom";

import travel from '../assets/images/travel-train-station.svg'

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import {FiPhone, FiMail,FiMapPin} from '../assets/icons/vander'
import axiosInstance from "../api/axios";

export default function Contact(){

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await axiosInstance.post('/contact-messages/', formData);
            setResponseMessage('Your message has been sent successfully!');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
        } catch (error) {
            setResponseMessage('There was an error sending your message. Please try again.');
        }
    };

    return(
        <>
            <Navbar navclass="defaultscroll is-sticky" navlight={false} manuclass="justify-end" />
            <div className="container-fluid relative mt-20">
                <div className="grid grid-cols-1">
                    <div className="w-full leading-[0] border-0">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d236.2544476761244!2d73.80434479802867!3d18.660802358989933!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2b8285781f645%3A0x8353c96ff3c016a6!2s18%2F42%2C%20Shivtej%20Nagar%2C%20Bhosari%2C%20Pimpri%20Chinchwad%2C%20Pimpri-Chinchwad%2C%20Maharashtra%20411019!5e0!3m2!1sen!2sin!4v1725652100258!5m2!1sen!2sin"
                            style={{ border: '0' }}
                            title="bluedive"
                            className="w-full h-[500px]"
                        ></iframe>
                    </div>
                </div>
            </div>
            <section className="relative lg:py-24 py-16">
                <div className="container">
                    <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-6">
                        <div className="lg:col-span-7 md:col-span-6">
                            <img src={travel} className="w-full max-w-[500px] mx-auto" alt="Travel illustration" />
                        </div>

                        <div className="lg:col-span-5 md:col-span-6">
                            <div className="lg:ms-5">
                                <div className="bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-800 p-6">
                                    <h3 className="mb-6 text-2xl leading-normal font-semibold">Get in touch !</h3>
                                    {responseMessage && (
                                        <p className="mb-4 text-center text-red-500">{responseMessage}</p>
                                    )}
                                    <form onSubmit={handleSubmit}>
                                        <div className="grid lg:grid-cols-12 grid-cols-1 gap-3">
                                            <div className="lg:col-span-6">
                                                <label htmlFor="name" className="font-semibold">Your Name:</label>
                                                <input
                                                    name="name"
                                                    id="name"
                                                    type="text"
                                                    value={formData.name}
                                                    onChange={handleChange}
                                                    className="mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                                                    placeholder="Name :"
                                                    required
                                                />
                                            </div>

                                            <div className="lg:col-span-6">
                                                <label htmlFor="email" className="font-semibold">Your Email:</label>
                                                <input
                                                    name="email"
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className="mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                                                    placeholder="Email :"
                                                    required
                                                />
                                            </div>

                                            <div className="lg:col-span-12">
                                                <label htmlFor="subject" className="font-semibold">Subject:</label>
                                                <input
                                                    name="subject"
                                                    id="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className="mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                                                    placeholder="Subject :"
                                                    required
                                                />
                                            </div>

                                            <div className="lg:col-span-12">
                                                <label htmlFor="message" className="font-semibold">Your Message:</label>
                                                <textarea
                                                    name="message"
                                                    id="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    className="mt-2 w-full py-2 px-3 h-28 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                                                    placeholder="Message :"
                                                ></textarea>
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            id="submit"
                                            name="send"
                                            className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md mt-2"
                                        >
                                            Send Message
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
                                    <Link to="mailto:contact@bluedive.in" className="text-red-500 font-medium">contact@bluedive.in</Link>
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
    )
}