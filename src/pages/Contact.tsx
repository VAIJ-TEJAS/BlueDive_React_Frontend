import { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

import travel from '../assets/images/travel-train-station.svg'

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import {FiPhone, FiMail,FiMapPin} from '../assets/icons/vander'
import axiosInstance from "../api/axios";

interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

export default function Contact(){

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [responseMessage, setResponseMessage] = useState('');
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Memoized validation functions
    const validateName = useCallback((name: string): string | undefined => {
        if (!name.trim()) {
            return 'Name is required';
        }
        if (name.trim().length < 2) {
            return 'Name must be at least 2 characters long';
        }
        if (name.trim().length > 100) {
            return 'Name cannot exceed 100 characters';
        }
        if (!/^[a-zA-Z\s'-]+$/.test(name.trim())) {
            return 'Name can only contain letters, spaces, hyphens, and apostrophes';
        }
        return undefined;
    }, []);

    const validateEmail = useCallback((email: string): string | undefined => {
        if (!email.trim()) {
            return 'Email is required';
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email.trim())) {
            return 'Please enter a valid email address';
        }
        if (email.trim().length > 254) {
            return 'Email cannot exceed 254 characters';
        }
        return undefined;
    }, []);

    const validateSubject = useCallback((subject: string): string | undefined => {
        if (!subject.trim()) {
            return 'Subject is required';
        }
        if (subject.trim().length < 3) {
            return 'Subject must be at least 3 characters long';
        }
        if (subject.trim().length > 200) {
            return 'Subject cannot exceed 200 characters';
        }
        return undefined;
    }, []);

    const validateMessage = useCallback((message: string): string | undefined => {
        if (!message.trim()) {
            return 'Message is required';
        }
        if (message.trim().length < 10) {
            return 'Message must be at least 10 characters long';
        }
        if (message.trim().length > 2000) {
            return 'Message cannot exceed 2000 characters';
        }
        return undefined;
    }, []);

    const validateForm = useCallback((): FormErrors => {
        const newErrors: FormErrors = {};
        
        const nameError = validateName(formData.name);
        if (nameError) newErrors.name = nameError;
        
        const emailError = validateEmail(formData.email);
        if (emailError) newErrors.email = emailError;
        
        const subjectError = validateSubject(formData.subject);
        if (subjectError) newErrors.subject = subjectError;
        
        const messageError = validateMessage(formData.message);
        if (messageError) newErrors.message = messageError;
        
        return newErrors;
    }, [formData, validateName, validateEmail, validateSubject, validateMessage]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        
        setIsSubmitting(true);
        setResponseMessage('');

        // Validate form
        const formErrors = validateForm();
        setErrors(formErrors);
        
        if (Object.keys(formErrors).length > 0) {
            setIsSubmitting(false);
            return;
        }

        try {
            await axiosInstance.post('/contact-messages/', formData);
            setResponseMessage('Your message has been sent successfully!');
            setFormData({
                name: '',
                email: '',
                subject: '',
                message: ''
            });
            setErrors({});
        } catch (error) {
            console.error('Error sending message:', error);
            setResponseMessage('There was an error sending your message. Please try again.');
        } finally {
            setIsSubmitting(false);
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
                                        <p className={`mb-4 text-center ${responseMessage.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
                                            {responseMessage}
                                        </p>
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
                                                    className={`mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border ${errors.name ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'} focus:ring-0`}
                                                    placeholder="Name :"
                                                    disabled={isSubmitting}
                                                />
                                                {errors.name && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                                )}
                                            </div>

                                            <div className="lg:col-span-6">
                                                <label htmlFor="email" className="font-semibold">Your Email:</label>
                                                <input
                                                    name="email"
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                    className={`mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border ${errors.email ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'} focus:ring-0`}
                                                    placeholder="Email :"
                                                    disabled={isSubmitting}
                                                />
                                                {errors.email && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                                                )}
                                            </div>

                                            <div className="lg:col-span-12">
                                                <label htmlFor="subject" className="font-semibold">Subject:</label>
                                                <input
                                                    name="subject"
                                                    id="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    className={`mt-2 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border ${errors.subject ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'} focus:ring-0`}
                                                    placeholder="Subject :"
                                                    disabled={isSubmitting}
                                                />
                                                {errors.subject && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.subject}</p>
                                                )}
                                            </div>

                                            <div className="lg:col-span-12">
                                                <label htmlFor="message" className="font-semibold">Your Message:</label>
                                                <textarea
                                                    name="message"
                                                    id="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    className={`mt-2 w-full py-2 px-3 h-28 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border ${errors.message ? 'border-red-500' : 'border-gray-100 dark:border-gray-800'} focus:ring-0`}
                                                    placeholder="Message :"
                                                    disabled={isSubmitting}
                                                ></textarea>
                                                {errors.message && (
                                                    <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                                                )}
                                            </div>

                                            <div className="lg:col-span-12">
                                                <button 
                                                    type="submit" 
                                                    className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md w-full hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                                </button>
                                            </div>
                                        </div>
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