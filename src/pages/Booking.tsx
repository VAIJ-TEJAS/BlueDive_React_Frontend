import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import {
  FiClock,
} from "../assets/icons/vander";

import axios from "../api/axios";
import {
  IPackage,
  IPaxOptions,
} from "../types/package.types";
import { ITrip } from "../types/trip.types";
import moment from "moment";
import "react-18-image-lightbox/style.css";
import "../../node_modules/react-datepicker/dist/react-datepicker.css";
import "tiny-slider/dist/tiny-slider.css";

export default function Booking() {
  const { package_name } = useParams();
  const [packageDetails, setPackageDetails] = useState<IPackage | null>(null);
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [paxOptions, setPaxOptions] = useState<IPaxOptions[]>([]);
  const [values, setValues] = useState<Record<string, number>>({});
  const [selectedTripIndex, setSelectedTripIndex] = useState<number | null>(
    null
  );

  const handleIncrement = (pax: number) => {
    setValues((prevValues) => ({
      ...prevValues,
      [pax]: (prevValues[pax] || 0) + 1,
    }));
  };

  const handleDecrement = (pax: number) => {
    setValues((prevValues) => ({
      ...prevValues,
      [pax]: Math.max((prevValues[pax] || 0) - 1, 0),
    }));
  };


  useEffect(() => {
    // Fetch package details
    axios
      .get(`/packages-trips/?name=${package_name}`)
      .then((response) => {

        const packageData:IPackage = response.data[0];

        setPackageDetails({
          ...packageData,
          trips: undefined,
          pax_options: undefined,
          images: undefined,
        });

        setPaxOptions(packageData.pax_options || []);
        setTrips(packageData.trips || []);

        const initialValues = packageData.pax_options?.reduce(
          (acc: Record<string, number>, option: IPaxOptions) => {
            acc[option.pax] = 0;
            return acc;
          },
          {} as Record<string, number>
        );
        setValues(initialValues || {});

        console.log(packageData);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [package_name]);

  return (
    <>
      <Navbar
        navclass="defaultscroll is-sticky"
        navlight={false}
        manuclass="justify-end"
      />

      <section className="relative md:pb-24 pb-16 mt-20">


        <div className="container relative md:mt-24 mt-16">
          <div className="grid md:grid-cols-12 grid-cols-1 gap-6">
            <div className="lg:col-span-8 md:col-span-7">

              <h5 className="text-2xl font-semibold">{packageDetails?.name}</h5>
              <p className="flex items-center text-slate-400 font-medium my-2">
                <FiClock className="text-red-500 size-4 me-1" />{" "}
                {packageDetails?.duration}
              </p>
              <h5 className="text-2xl text-red-500 font-semibold my-2">9 August 2024 - 11 August 2024</h5>

            </div>

            {/* Sidebar  */}
            <div className="lg:col-span-4 md:col-span-5">
              <div className="p-4 rounded-md shadow dark:shadow-gray-700 sticky top-20">
                <div className="flex flex-col">
                  <label className="font-medium">Trip Date:</label>

                  <div className="flex flex-wrap gap-2 mt-4 md:mt-2">
                    {trips.map((trip, index) => {
                      const day = moment(trip.start_date).format("DD");
                      const month = moment(trip.start_date).format("MMM");
                      const year = moment(trip.start_date).format("YY");
                      const isSelected = selectedTripIndex === index;

                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedTripIndex(index)}
                          className={`py-2 px-3 inline-block tracking-wide duration-500 text-base rounded-md
                          ${
                            isSelected
                              ? "border border-yellow-400 bg-red-500 text-white"
                              : "border border-red-500 text-red-500"
                          }`}
                        >
                          <div className="flex items-center gap-1">
                            <p className="text-lg font-bold">{day}</p>
                            <p className="text-xs">{month}</p>
                            <p className="text-xs">{year}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <p
                              className={`text-lg font-bold
                                ${isSelected ? "text-yellow-400" : "text-black"}
                            `}
                            >
                              {trip.available_seats.toString().padStart(2, "0")}
                            </p>
                            <p className="text-xs text-wrap w-min text-left">
                              seats available
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4">
                  <div className="">
                    <span className="font-medium">Pax:</span>
                    <div className="mt-4 md:mt-0">
                      {paxOptions.map((option) => (
                        <li
                          className="inline-flex items-center  w-full py-2 border-b border-slate-200"
                          key={option.pax}
                        >
                          <div className="text-base font-medium mr-4">
                            {option.pax} PAX
                          </div>
                          <div className="flex-1 flex justify-between items-center">
                            <button
                              className="inline-flex items-center justify-center w-8 h-8 text-base font-semibold text-white bg-red-500 rounded"
                              onClick={() => handleDecrement(option.pax)}
                            >
                              -
                            </button>
                            <span className="text-base mx-2">
                              {values[option.pax] || 0}
                            </span>
                            <button
                              className="inline-flex items-center justify-center w-8 h-8 text-base font-semibold text-white bg-red-500 rounded"
                              onClick={() => handleIncrement(option.pax)}
                            >
                              +
                            </button>
                          </div>
                        </li>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <button className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md w-full">
                    Pay Now
                  </button>
                </div>

                {/* <div className="mt-6">
                  <h5 className="text-lg font-medium">Tour Map</h5>

                  <div className="mt-3">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d39206.002432144705!2d-95.4973981212445!3d29.709510002925988!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8640c16de81f3ca5%3A0xf43e0b60ae539ac9!2sGerald+D.+Hines+Waterwall+Park!5e0!3m2!1sen!2sin!4v1566305861440!5m2!1sen!2sin"
                      style={{ border: "0" }}
                      title="travosy"
                      className="w-full h-[300px] rounded-full"
                    ></iframe>
                  </div>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
