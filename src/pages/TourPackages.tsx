import { Link } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import { useEffect, useState } from "react";
import axios from "../api/axios";
import PackageCard from "../components/package-card";

export default function TourPackages(){

  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Make the GET request to the '/packages' endpoint
        const response = await axios.get("/packages-overview/");

        // Set the response data to the state
        setPackages(response.data);

      } catch (err) {
        // Handle any errors
        console.error(err);
      } finally {
        // Finally set some variables
      }
    };

    fetchPackages();
  }, []);

    return(
        <>
        <Navbar navclass="defaultscroll is-sticky" navlight={true} manuclass="justify-end nav-light"/>

        <section className="relative table w-full items-center py-36 bg-[url('../../assets/images/bg/cta.jpg')] bg-top bg-no-repeat bg-cover">
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/80 to-slate-900"></div>
            <div className="container relative">
                <div className="grid grid-cols-1 pb-8 text-center mt-10">
                    <h3 className="text-4xl leading-normal tracking-wider font-semibold text-white">Tour Packages</h3>
                </div>
            </div>
            
            <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
                <ul className="tracking-[0.5px] mb-0 inline-block">
                    <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out text-white/50 hover:text-white"><Link to="/">Bluedive</Link></li>
                    <li className="inline-block text-base text-white/50 mx-0.5 ltr:rotate-0 rtl:rotate-180"><i className="mdi mdi-chevron-right"></i></li>
                    <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out text-white" aria-current="page">Tour</li>
                </ul>
            </div>
        </section>

        <section className="relative md:py-24 py-16">
            <div className="container relative">
                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-6">
                    {packages.map((item,index)=>{
                        return(
                          <PackageCard key={index} item={item} />
                        )
                    })}
                </div>

            </div>
        </section>
        <Footer/>
        </>
    )
}