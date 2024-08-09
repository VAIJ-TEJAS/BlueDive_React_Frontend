import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import image1 from "../assets/images/listing/1.jpg";
import image2 from "../assets/images/listing/2.jpg";
import image3 from "../assets/images/listing/3.jpg";
import image4 from "../assets/images/listing/4.jpg";
import image5 from "../assets/images/listing/5.jpg";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import {
  FiCalendar,
  FiCamera,
  FiClock,
  FiCoffee,
  FiMapPin,
  FiSun,
  GiCroissant,
  GiDolphin,
  GiWaterSplash,
  MdLocalDining,
  MdRestaurantMenu,
} from "../assets/icons/vander";

import Lightbox from "react-18-image-lightbox";
import axios from "../api/axios";
import {
  IDayRecord,
  IEventRecord,
  IPackage,
  IPaxOptions,
} from "../types/package.types";
import { ITrip } from "../types/trip.types";
import "react-18-image-lightbox/style.css";
import "../../node_modules/react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export default function Package() {
  const { package_name } = useParams();
  const [packageDetails, setPackageDetails] = useState<IPackage | null>(null);
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [paxOptions, setPaxOptions] = useState<IPaxOptions[]>([]);
  const [values, setValues] = useState<Record<string, number>>({});
  const [selectedTripIndex, setSelectedTripIndex] = useState<number | null>(
    null
  );

  let images = [image1, image2, image3, image4, image5];
  let [photoIndex, setActiveIndex] = useState(0);
  let [isOpen, setOpen] = useState(false);

  let handleCLick = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

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

  const iconMatrix: Record<string, JSX.Element> = {
    Pickup: <FiMapPin className="size-4 text-red-500" />,
    Breakfast: <GiCroissant className="size-4 text-yellow-500" />,
    "Tea / Coffee": <FiCoffee className="size-4 text-amber-800" />,
    "Sea Safari": <GiDolphin className="size-4 text-blue-500" />,
    "Water Sports": <GiWaterSplash className="size-4 text-sky-500" />,
    Lunch: <MdRestaurantMenu className="size-4 text-orange-500" />,
    Dinner: <MdLocalDining className="size-4 text-purple-500" />,
    "Scuba Diving": <FiSun className="size-4 text-blue-600" />,
    Drop: <FiMapPin className="size-4 text-red-500" />,
  };

  const getIconByName = (name: string): JSX.Element | null => {
    return iconMatrix[name] || null;
  };

  useEffect(() => {
    // Fetch package details
    axios
      .get(`/packages-trips/?name=${package_name}`)
      .then((response) => {
        const packageData = response.data[0];
        setPackageDetails({
          ...packageData,
          trips: undefined,
          pax_options: undefined,
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
        <div className="container-fluid relative">
          <div className="md:flex mt-4">
            <div className="lg:w-1/2 md:w-1/2 p-1">
              <div className="group relative overflow-hidden rounded-md shadow dark:shadow-gray-800">
                <img src={image1} alt="" />
                <div className="absolute inset-0 group-hover:bg-slate-900/70 duration-500 ease-in-out"></div>
                <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 text-center opacity-0 group-hover:opacity-100 duration-500">
                  <Link
                    to="#"
                    onClick={() => handleCLick(0)}
                    className="inline-flex justify-center items-center size-9 bg-red-500 text-white rounded-full lightbox"
                  >
                    <FiCamera className="size-4 align-middle"></FiCamera>
                  </Link>
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 md:w-1/2">
              <div className="flex">
                <div className="w-1/2 p-1">
                  <div className="group relative overflow-hidden rounded-md shadow dark:shadow-gray-800">
                    <img src={image2} alt="" />
                    <div className="absolute inset-0 group-hover:bg-slate-900/70 duration-500 ease-in-out"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 text-center opacity-0 group-hover:opacity-100 duration-500">
                      <Link
                        to="#"
                        onClick={() => handleCLick(1)}
                        className="inline-flex justify-center items-center size-9 bg-red-500 text-white rounded-full lightbox"
                      >
                        <FiCamera className="size-4 align-middle"></FiCamera>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 p-1">
                  <div className="group relative overflow-hidden rounded-md shadow dark:shadow-gray-800">
                    <img src={image3} alt="" />
                    <div className="absolute inset-0 group-hover:bg-slate-900/70 duration-500 ease-in-out"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 text-center opacity-0 group-hover:opacity-100 duration-500">
                      <Link
                        to="#"
                        onClick={() => handleCLick(2)}
                        className="inline-flex justify-center items-center size-9 bg-red-500 text-white rounded-full lightbox"
                      >
                        <FiCamera className="size-4 align-middle"></FiCamera>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex">
                <div className="w-1/2 p-1">
                  <div className="group relative overflow-hidden rounded-md shadow dark:shadow-gray-800">
                    <img src={image4} alt="" />
                    <div className="absolute inset-0 group-hover:bg-slate-900/70 duration-500 ease-in-out"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 text-center opacity-0 group-hover:opacity-100 duration-500">
                      <Link
                        to="#"
                        onClick={() => handleCLick(3)}
                        className="inline-flex justify-center items-center size-9 bg-red-500 text-white rounded-full lightbox"
                      >
                        <FiCamera className="size-4 align-middle"></FiCamera>
                      </Link>
                    </div>
                  </div>
                </div>

                <div className="w-1/2 p-1">
                  <div className="group relative overflow-hidden rounded-md shadow dark:shadow-gray-800">
                    <img src={image5} alt="" />
                    <div className="absolute inset-0 group-hover:bg-slate-900/70 duration-500 ease-in-out"></div>
                    <div className="absolute top-1/2 -translate-y-1/2 start-0 end-0 text-center opacity-0 group-hover:opacity-100 duration-500">
                      <Link
                        to="#"
                        onClick={() => handleCLick(4)}
                        className="inline-flex justify-center items-center size-9 bg-red-500 text-white rounded-full lightbox"
                      >
                        <FiCamera className="size-4 align-middle"></FiCamera>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container relative md:mt-24 mt-16">
          <div className="grid md:grid-cols-12 grid-cols-1 gap-6">
            <div className="lg:col-span-8 md:col-span-7">
              <h5 className="text-2xl font-semibold">{packageDetails?.name}</h5>
              <p className="flex items-center text-slate-400 font-medium mt-2">
                <FiClock className="text-red-500 size-4 me-1" />{" "}
                {packageDetails?.duration}
              </p>

              {/* <ul className="list-none">
                {tourDetailAbout.map((item, index) => {
                  let Icon = item.icon;
                  return (
                    <li
                      className="inline-flex items-center me-5 mt-5"
                      key={index}
                    >
                      <Icon className="size-6 stroke-[1.5] text-red-500"></Icon>

                      <div className="ms-3">
                        <p className="font-medium">{item.name}</p>
                        <span className="text-slate-400 font-medium text-sm">
                          {item.title}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul> */}

              <div className="mt-6">
                <h5 className="text-lg font-semibold">Tour Description</h5>

                <p className="text-slate-400 mt-6">
                  {packageDetails?.description}
                </p>
              </div>

              <div className="mt-6">
                <h5 className="text-lg font-semibold  mb-6">Itinerary</h5>

                <div className="p-4 flex flex-col gap-4 rounded-md shadow dark:shadow-gray-700">
                  {packageDetails?.day_records?.map(
                    (dayRecord: IDayRecord, dayIndex: number) => (
                      <div key={dayIndex} className="">
                        <div className="font-medium inline-flex gap-1 items-center">
                          <FiCalendar className="size-4 align-middle text-red-500" />{" "}
                          {dayRecord.day.name}
                        </div>
                        <p className="text-sm text-slate-400">
                          {dayRecord.day.description}
                        </p>

                        {dayRecord.day.event_records?.map(
                          (eventRecord: IEventRecord, eventIndex: number) => (
                            <div key={eventIndex} className="mt-2 ml-8">
                              <div className="font-medium inline-flex gap-1 items-center">
                                {getIconByName(eventRecord.event.name)}{" "}
                                {eventRecord.event.name}
                              </div>
                              <p className="text-sm text-slate-400">
                                {eventRecord.event.description}
                              </p>

                              {eventRecord.event.options?.map(
                                (option, optionIndex) => (
                                  <div key={optionIndex} className="ml-8 flex gap-1">
                                    <div>
                                        •
                                    </div>
                                    <div>
                                      <p className="text-red-500">
                                        {option.name}
                                      </p>
                                      <p className="text-sm text-slate-400">
                                        {option.description}
                                      </p>
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )
                        )}
                      </div>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h5 className="text-lg font-semibold mb-6">Accomodation</h5>

                <div className="p-4 flex flex-col gap-4 rounded-md shadow dark:shadow-gray-700">
                    
                </div>
              </div>
            </div>

            {/* Sidebar  */}
            <div className="lg:col-span-4 md:col-span-5">
              <div className="p-4 rounded-md shadow dark:shadow-gray-700 sticky top-20">
                <div className="flex flex-col">
                  <label className="font-medium">Date:</label>

                  <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
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
                    Book Now
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
      {isOpen && (
        <Lightbox
          mainSrc={images[photoIndex]}
          nextSrc={images[(photoIndex + 1) % images.length]}
          prevSrc={images[(photoIndex + images.length - 1) % images.length]}
          onCloseRequest={() => setOpen(false)}
          onMovePrevRequest={() =>
            setActiveIndex((photoIndex + images.length - 1) % images.length)
          }
          onMoveNextRequest={() =>
            setActiveIndex((photoIndex + 1) % images.length)
          }
        />
      )}
    </>
  );
}
