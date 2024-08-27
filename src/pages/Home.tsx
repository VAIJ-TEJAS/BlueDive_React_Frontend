import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Tagline from "../components/tagline";
import Navbar from "../components/navbar";
import Footer from "../components/footer";
import TopDestinationOne from "../components/top-destination-one";
import About from "../components/about";
import Client from "../components/client";

import faqImg from "../assets/images/bg/6.jpg";
import heroImg from "../assets/images/bg/main.jpg";

import { FiVideo, FiChevronDown } from "../assets/icons/vander";

import ModalVideo from "react-modal-video";
import "../../node_modules/react-modal-video/scss/modal-video.scss";

import { Parallax } from "react-parallax";

import { faqData } from "../data/data";

import axios from "../api/axios";
import PackageCard from "../components/package-card";

export default function Home() {
  let [isOpen, setOpen] = useState(false);
  let [activeIndex, setActiveIndex] = useState(1);

  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Make the GET request to the '/packages' endpoint
        const response = await axios.get("/packages-overview/");

        console.log(response.data)

        // Set the response data to the state
        setPackages(response.data);

      } catch (err) {
        // Handle any errors
        console.log(err);
      } finally {
        // Finally set some variables
      }
    };

    fetchPackages();
  }, []);

  return (
    <>
      <Tagline />
      <Navbar
        navclass="defaultscroll is-sticky tagline-height"
        navlight={true}
        manuclass="justify-end nav-light"
      />
      <section
        className="relative py-36 bg-[url('../../assets/images/bg/main.jpg')] bg-cover jarallax"
        data-jarallax
        data-speed="0.5"
      >
        <Parallax
          bgImage={heroImg}
          bgImageAlt="Beach Vacation"
          strength={200}
          className="hidden lg:block absolute inset-0"
        />

        <div className="absolute inset-0 bg-slate-900/40"></div>
        <div className="container relative">
          <div className="grid lg:grid-cols-12 md:grid-cols-2 mt-10 items-center gap-6">
            <div className="lg:col-span-7">
              <h5 className="text-3xl font-dancing text-white">
                See your Sea Weekends...
              </h5>
              <h4 className="font-bold text-white lg:leading-normal leading-normal text-4xl lg:text-6xl mb-6 mt-5">
                Where Do You <br /> Want To Go?
              </h4>
              <p className="text-white/70 text-xl max-w-xl">
                Planning for a trip? We will organize your trip with the best
                places and within best budget!
              </p>

              <div className="mt-6">
                <Link
                  to=""
                  className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md"
                >
                  View Packages
                </Link>
                <Link
                  to="#!"
                  onClick={() => setOpen(true)}
                  className="size-10 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-full border border-red-500 bg-red-500 text-white ms-1 lightbox"
                >
                  <FiVideo className="h-4 w-4"></FiVideo>
                </Link>
                <span className="font-semibold ms-1 align-middle"></span>
              </div>
              <ModalVideo
                channel="youtube"
                youtube={{ mute: 0, autoplay: 0 }}
                isOpen={isOpen}
                videoId="S_CGed6E610"
                onClose={() => setOpen(false)}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="absolute block w-full h-auto bottom-[25px] z-1 start-0">
          <Link to="#">
            <i className="mdi mdi-arrow-down absolute top-0 start-0 end-0 text-center inline-flex items-center justify-center rounded-full bg-white dark:bg-slate-900 h-12 w-12 mx-auto shadow-md dark:shadow-gray-800"></i>
          </Link>
        </div>

        <div className="shape absolute sm:-bottom-px -bottom-[2px] start-0 end-0 overflow-hidden text-white dark:text-slate-900">
          <svg
            className="w-full h-auto scale-[2.0] origin-top"
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <section className="relative md:py-24 py-16">
        <TopDestinationOne />

        <div className="container relative md:mt-24 mt-16">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
              Tours Packages
            </h3>

            <p className="text-slate-400 max-w-xl mx-auto">
              Planning for a trip? We will organize your trip with the best
              places and within best budget!
            </p>
          </div>

          <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
            {packages.slice(0, 3).map((item, index) => (
              <PackageCard key={index} item={item} />
            ))}
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/grid-right-sidebar"
              className="text-slate-400 hover:text-red-500 inline-block"
            >
              See More Tours{" "}
              <i className="mdi mdi-arrow-right align-middle"></i>
            </Link>
          </div>
        </div>

        <About />

        <Client />

        <div className="container relative md:mt-24 mt-16">
          <div className="grid grid-cols-1 pb-6 text-center">
            <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
              Frequently Asked Questions
            </h3>

            <p className="text-slate-400 max-w-xl mx-auto">
              This is just a simple text made for this unique and awesome
              template, you can replace it with any text.
            </p>
          </div>

          <div className="relative grid md:grid-cols-12 grid-cols-1 items-center mt-6 gap-6">
            <div className="md:col-span-6">
              <img
                src={faqImg}
                className="w-full h-[540px] object-cover rounded-md shadow dark:shadow-gray-800"
                alt=""
              />
            </div>

            <div className="md:col-span-6">
              <div>
                {faqData.map((item, index) => {
                  return (
                    <div
                      className="relative shadow dark:shadow-gray-800 rounded-md overflow-hidden mt-4 first:mt-0"
                      key={index}
                    >
                      <h2
                        className="text-base font-semibold"
                        id="accordion-collapse-heading-1"
                      >
                        <button
                          type="button"
                          className={`flex justify-between items-center p-5 w-full font-medium text-start ${
                            activeIndex === item.id
                              ? "bg-gray-50 dark:bg-slate-800 text-red-500"
                              : ""
                          }`}
                          onClick={() => setActiveIndex(item.id)}
                        >
                          <span>{item.title}</span>
                          <FiChevronDown
                            className={`w-4 h-4 shrink-0 ${
                              activeIndex === item.id ? "rotate-180" : ""
                            }`}
                          ></FiChevronDown>
                        </button>
                      </h2>
                      <div className={activeIndex === item.id ? "" : "hidden"}>
                        <div className="p-5">
                          <p className="text-slate-400 dark:text-gray-400">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
