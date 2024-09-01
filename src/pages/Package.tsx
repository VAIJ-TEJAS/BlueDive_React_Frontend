import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import TinySlider from "tiny-slider-react";

import {
  FiCalendar,
  FiCamera,
  FiClock,
  FiCoffee,
  FiMapPin,
  GiDolphin,
  GiScubaMask,
  GiSurfBoard,
  MdFreeBreakfast,
  MdLocalDining,
  MdRestaurantMenu,
} from "../assets/icons/vander";

import Lightbox from "react-18-image-lightbox";
import axios from "../api/axios";
import {
  IDayRecord,
  IEventRecord,
  IPackage,
  IPackageImages,
} from "../types/package.types";
import { ITrip } from "../types/trip.types";
import moment from "moment";
import "react-18-image-lightbox/style.css";
import "../../node_modules/react-datepicker/dist/react-datepicker.css";
import "tiny-slider/dist/tiny-slider.css";
import { FaTag } from "react-icons/fa6";

export default function Package() {
  const { package_name } = useParams();
  const [packageDetails, setPackageDetails] = useState<IPackage | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<ITrip | null>(null);

  let [photoIndex, setActiveIndex] = useState(0);
  let [isOpen, setOpen] = useState(false);

  let handleCLick = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const iconMatrix: Record<string, JSX.Element> = {
    Pickup: <FiMapPin className="size-4 text-red-500" />,
    Breakfast: <MdFreeBreakfast className="size-4 text-yellow-500" />,
    "Tea / Coffee": <FiCoffee className="size-4 text-amber-800" />,
    "Sea Safari": <GiDolphin className="size-4 text-blue-500" />,
    "Water Sports": <GiSurfBoard className="size-4 text-sky-500" />,
    Lunch: <MdRestaurantMenu className="size-4 text-orange-500" />,
    Dinner: <MdLocalDining className="size-4 text-purple-500" />,
    "Scuba Diving": <GiScubaMask className="size-4 text-blue-600" />,
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
        const packageData: IPackage = response.data[0];

        setPackageDetails({
          ...packageData,
          trips: undefined,
          pax_options: undefined,
          images: undefined,
        });

        setImages(
          packageData?.images?.map((image: IPackageImages) => image.image) || []
        );

        const tripsData = packageData.trips || [];

        setTrips(tripsData);
        if (tripsData.length > 0) {
          setSelectedTrip(tripsData[0]);
        }

        console.log(packageData);
      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [package_name]);

  const settings = {
    container: ".tiny-five-item",
    controls: true,
    mouseDrag: true,
    loop: true,
    rewind: true,
    autoplay: true,
    autoplayButtonOutput: false,
    autoplayTimeout: 3000,
    navPosition: "bottom",
    controlsText: [
      '<i class="mdi mdi-chevron-left "></i>',
      '<i class="mdi mdi-chevron-right"></i>',
    ],
    nav: false,
    speed: 400,
    gutter: 0,
    items: 1,
  };

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
                <img src={images[0]} alt="" />
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
                    <img src={images[1]} alt="" />
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
                    <img src={images[2]} alt="" />
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
                    <img src={images[3]} alt="" />
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
                    <img src={images[5]} alt="" />
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
              <div className="">
                <span className="text-[12px] text-slate-400 mr-1">UP TO</span>
                <span className="bg-red-500 text-white text-[12px] px-2.5 py-1 font-medium rounded-md h-5">
                  {packageDetails?.display_discount_percentage}% OFF
                </span>
              </div>
              <h5 className="text-2xl font-semibold">{packageDetails?.name}</h5>
              <h5 className="text-2xl text-red-500 font-semibold">
                starts at just ₹ {packageDetails?.display_price}*/-
              </h5>
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
                {/* <h5 className="text-lg font-semibold">Tour Description</h5> */}

                <p className="text-slate-400 mt-6">
                  {packageDetails?.description}
                </p>
              </div>

              <div className="mt-6">
                <h5 className="text-xl font-semibold  mb-6 text-sky-500">
                  Itinerary
                </h5>

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
                                {eventRecord.event.standard_option && (
                                  <div className="text-slate-400">
                                    - {eventRecord.event.standard_option}
                                  </div>
                                )}
                              </div>
                              <p className="text-sm text-slate-400">
                                {eventRecord.event.description}
                              </p>

                              {eventRecord.event.options?.map(
                                (option, optionIndex) => (
                                  <div
                                    key={optionIndex}
                                    className="ml-8 flex gap-1"
                                  >
                                    <div>•</div>
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

              {packageDetails?.accommodation && (
                <div className="mt-6">
                  <h5 className="text-xl font-semibold mb-6 text-sky-500">
                    Accomodation
                  </h5>

                  <div className="p-4 flex flex-col gap-4 rounded-md shadow dark:shadow-gray-700">
                    <div>
                      <div className="font-medium">
                        {packageDetails?.accommodation?.name}
                      </div>
                      <p className="text-sm text-slate-400">
                        {packageDetails?.accommodation?.details}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 relative">
                      <div className="tiny-five-item">
                        <TinySlider settings={settings}>
                          {packageDetails?.accommodation?.images?.map(
                            (item, index) => {
                              return (
                                <div className="tiny-slide" key={index}>
                                  <div className="group relative overflow-hidden rounded-md shadow dark:shadow-gray-800 m-2">
                                    <img
                                      src={item.image}
                                      className="w-full h-72 object-cover scale-125 group-hover:scale-100 duration-500"
                                      alt=""
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b to-slate-900 from-transparent opacity-0 group-hover:opacity-100 duration-500"></div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </TinySlider>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {packageDetails?.vehicle && (
                <div className="mt-6">
                  <h5 className="text-xl font-semibold mb-6 text-sky-500">
                    Travel
                  </h5>

                  <div className="p-4 flex flex-col gap-4 rounded-md shadow dark:shadow-gray-700">
                    <div>
                      <div className="font-medium">
                        {packageDetails?.vehicle?.name}
                      </div>
                      <p className="text-sm text-slate-400">
                        {packageDetails?.vehicle?.details}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 relative">
                      <div className="tiny-five-item">
                        <TinySlider settings={settings}>
                          {packageDetails?.vehicle?.images?.map(
                            (item, index) => {
                              return (
                                <div className="tiny-slide" key={index}>
                                  <div className="group relative overflow-hidden rounded-md shadow dark:shadow-gray-800 m-2">
                                    <img
                                      src={item.image}
                                      className="w-full h-72 object-cover scale-125 group-hover:scale-100 duration-500"
                                      alt=""
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-b to-slate-900 from-transparent opacity-0 group-hover:opacity-100 duration-500"></div>
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </TinySlider>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar  */}
            <div className="lg:col-span-4 md:col-span-5">
              <div className="p-4 rounded-md shadow dark:shadow-gray-700 sticky top-24">
                <div className="flex flex-col">
                  <label className="font-medium">Trip Date:</label>

                  <div className="flex flex-wrap gap-2 mt-4 md:mt-2">
                    {trips.map((trip, index) => {
                      const day = moment(trip.start_date).format("DD");
                      const month = moment(trip.start_date).format("MMM");
                      const year = moment(trip.start_date).format("YY");
                      const isSelected = selectedTrip?.id === trip.id;

                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedTrip(trip)}
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
                  <div
                    className={`${
                      selectedTrip?.is_scuba_free ||
                      selectedTrip?.is_discount_applicable
                        ? "p-2"
                        : ""
                    }`}
                  >
                    {(selectedTrip?.is_scuba_free ||
                      selectedTrip?.is_discount_applicable) && (
                      <div className="text-center font-bold text-xl py-4 text-red-500">
                        Book your trip now to grab:
                      </div>
                    )}
                    {selectedTrip?.is_scuba_free && (
                      <div className="flex gap-2 px-2">
                        <GiScubaMask className="flex-shrink-0 size-16 text-blue-600" />
                        <div>
                          <div className="font-bold w-full text-center">
                            Free Scuba Diving
                          </div>
                          <div className="text-slate-400">
                            On booking before{" "}
                            <span className="text-red-600">
                              {moment(
                                selectedTrip?.scuba_free_until_date
                              ).format("DD MMM YY")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    {selectedTrip?.is_scuba_free &&
                      selectedTrip?.is_discount_applicable && (
                        <div className="text-center font-bold text-xl text-red-500">
                          {"&"}
                        </div>
                      )}
                    {selectedTrip?.is_discount_applicable && (
                      <div className="flex gap-2 px-2">
                        <FaTag className="size-16 text-red-500" />
                        <div>
                          <div className="font-bold w-full text-center">
                            Exclusive Discounts
                          </div>
                          <div className="text-slate-400">
                            On booking before{" "}
                            <span className="text-red-600">
                              {moment(
                                selectedTrip?.discount_applicable_until_date
                              ).format("DD MMM YY")}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <Link
                    to={`/booking/${package_name}`} // Set the route
                    state={{ selectedTrip: selectedTrip }}
                    className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md w-full"
                  >
                    Book Now
                  </Link>
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
