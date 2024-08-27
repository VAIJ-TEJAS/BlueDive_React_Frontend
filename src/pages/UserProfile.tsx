import Navbar from "../components/navbar";
import AccountingTab from "../components/accounting-tab";
import Footer from "../components/footer";

import axios from "../api/axios";
import { useEffect, useState } from "react";
import TourCard from "../components/tour-card";

export default function UserProfile() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        // Make the GET request to the '/packages' endpoint
        const response = await axios.get("/bookings/");

        console.log(response.data);
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
      <Navbar
        navclass="defaultscroll is-sticky"
        navlight={false}
        manuclass="justify-end"
      />

      <section className="relative lg:pb-24 pb-16 md:mt-[84px] mt-[70px]">
        <div className="md:container container-fluid relative">
          <div className="relative overflow-hidden md:rounded-md shadow dark:shadow-gray-800 h-52 bg-[url('../../assets/images/bg/cta.jpg')] bg-center bg-no-repeat bg-cover"></div>
        </div>

        <div className="container relative md:mt-24 mt-16">
          <div className="md:flex">
            <AccountingTab />

            <div className="lg:w-3/4 md:w-2/3 md:px-3">
              <div>
                <p className="text-slate-400 mt-4">
                  Nam libero tempore, cum soluta nobis est eligendi optio cumque
                  nihil impedit quo minus id quod maxime placeat facere
                  possimus, omnis voluptas assumenda est, omnis dolor
                  repellendus how to pursue pleasure rationally encounter but
                  because those who do not know how to pursue consequences that
                  are extremely
                </p>
                <p className="text-slate-400 mt-2">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Quidem earum dicta saepe fugit, qui commodi possimus vero
                  pariatur asperiores. Sed impedit reprehenderit deserunt culpa
                  incidunt iste laborum placeat molestiae illo?
                </p>
              </div>

              <div className="mt-6">
                <h5 className="text-lg font-semibold mb-6">My Tours</h5>

                <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 mt-6 gap-6">
                  {packages.map((item, index) => (
                    <TourCard key={index} item={item} />
                  ))}
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
