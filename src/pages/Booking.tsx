import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Select, Input, Radio, Badge } from "antd";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

import {
  FiClock,
  GiCarrot,
  GiFruitBowl,
  GiMeat,
  GiScubaMask,
} from "../assets/icons/vander";

import axios from "../api/axios";
import {
  IMeal,
  IPackage,
  IPaxOptions,
  IPickupPoint,
  IWaterSportOption,
} from "../types/package.types";
import { ITrip } from "../types/trip.types";
import moment from "moment";
import "react-18-image-lightbox/style.css";
import "../../node_modules/react-datepicker/dist/react-datepicker.css";
import "tiny-slider/dist/tiny-slider.css";
import { ICustomerDetail, IPaxRecord } from "../types/booking-form.types";
import { RazorpayOptions } from "../types/razorpay";
import { FaTag } from "react-icons/fa6";
import { formatNumber } from "../utils/formatNumber";
import { Context } from "../context/context.provider";

const { Option } = Select;

// Function to generate a unique identifier
const generateId = () => "_" + Math.random().toString(36).substring(2, 11);

export default function Booking() {
  const { package_name } = useParams();
  const { userAuthenticated, showAuthModal } = Context();
  const location = useLocation();
  const navigate = useNavigate();

  const [packageDetails, setPackageDetails] = useState<IPackage | null>(null);
  const [trips, setTrips] = useState<ITrip[]>([]);
  const [paxOptions, setPaxOptions] = useState<IPaxOptions[]>([]);
  const [values, setValues] = useState<Record<number, number>>({});
  const [selectedTrip, setSelectedTrip] = useState<ITrip | null>(null);
  const [paxRecords, setPaxRecords] = useState<IPaxRecord[]>([]);
  const [waterSportsOptions, setWaterSportsOptions] = useState<
    IWaterSportOption[]
  >([]);
  const [pickupLocations, setPickupLocations] = useState<IPickupPoint[]>([]);
  const [mealOptions, setMealOptions] = useState<IMeal[]>([]);

  const [selectedPaymentOption, setSelectedPaymentOption] =
    useState<string>("full");
  const [advanceAmount, setAdvanceAmount] = useState<number>(0);
  const [fullAmount, setFullAmount] = useState<number>(0);
  const paxAdvanceCost = 2500;

  const handleRadioChange = (e: any) => {
    setSelectedPaymentOption(e.target.value);
  };

  const handleIncrement = (pax: number) => {
    setValues((prevValues) => ({
      ...prevValues,
      [pax]: (prevValues[pax] || 0) + 1,
    }));

    const paxOption = paxOptions.find((option) => option.pax === pax);
    const defaultMealRecord = paxOption?.meal_records?.find(
      (record) => record.meal.name === packageDetails?.default_meal_option?.name
    );
    const packageCost = defaultMealRecord ? defaultMealRecord.price : 0;
    const discountedPackageCost = defaultMealRecord
      ? defaultMealRecord.discounted_price
      : 0;

    const newPaxRecord: IPaxRecord = {
      id: generateId(),
      pax,
      customer_details: Array.from({ length: pax }, () => ({
        name: "",
        contact_number: "",
        pick_up_point: pickupLocations[0].name || "",
        meal_option: defaultMealRecord?.meal?.name || "",
        meal_option_id: defaultMealRecord?.id || 0,
        watersports_option: waterSportsOptions[0].name || "",
        package_cost: packageCost || 0,
        discounted_package_cost: discountedPackageCost || 0,
      })),
    };

    setPaxRecords((prevPaxRecords) => [...prevPaxRecords, newPaxRecord]);
  };

  const handleDecrement = (pax: number) => {
    setValues((prevValues) => {
      const newValues = {
        ...prevValues,
        [pax]: Math.max((prevValues[pax] || 0) - 1, 0),
      };

      // Update paxRecords based on the new pax count
      setPaxRecords((prevPaxRecords) => {
        // Remove records where pax count is zero
        const updatedRecords = prevPaxRecords.filter(
          (record) => !(record.pax === pax && newValues[pax] === 0)
        );

        return updatedRecords;
      });

      return newValues;
    });
  };

  const handleInputChange = (
    paxId: string,
    index: number,
    field: keyof ICustomerDetail,
    value: string
  ) => {
    setPaxRecords((prevPaxRecords) => {
      return prevPaxRecords.map((record) => {
        if (record.id === paxId) {
          const updatedDetails = record.customer_details.map((detail, i) => {
            if (i === index) {
              const updatedDetail = { ...detail, [field]: value };

              // Update package cost and discounted package cost if meal_option is changed
              if (field === "meal_option") {
                const selectedMealRecord = paxOptions
                  ?.find((option) => option.pax === record.pax)
                  ?.meal_records?.find((record) => record.meal.name === value);

                updatedDetail.meal_option_id = selectedMealRecord?.id;

                updatedDetail.package_cost = selectedMealRecord?.price || 0;
                updatedDetail.discounted_package_cost =
                  selectedMealRecord?.discounted_price || 0;
              }

              return updatedDetail;
            }
            return detail;
          });

          return { ...record, customer_details: updatedDetails };
        }
        return record;
      });
    });
  };

  const handleWaterSportChange = (
    paxId: string,
    index: number,
    value: string
  ) => {
    handleInputChange(paxId, index, "watersports_option", value);
  };

  const handlePickupChange = (paxId: string, index: number, value: string) => {
    handleInputChange(paxId, index, "pick_up_point", value);
  };

  const iconMatrix: Record<string, JSX.Element> = {
    Veg: <GiCarrot className="size-4 text-green-500" />, // Carrot icon for Veg
    "Non Veg": <GiMeat className="size-4 text-red-500" />, // Meat icon for Non Veg
    Mix: <GiFruitBowl className="size-4 text-orange-500" />, // Fruit Bowl icon for Mix
  };

  const getIconByName = (name: string): JSX.Element | null => {
    return iconMatrix[name] || null;
  };

  const handlePayNow = () => {
    if (selectedTrip !== null && packageDetails) {
      const payload = {
        payment_type: selectedPaymentOption,
        package_name: packageDetails.name,
        trip: selectedTrip.id,
        pax_records: paxRecords.map((record) => ({
          pax: record.pax,
          customer_details: record.customer_details.map((detail) => ({
            name: detail.name,
            contact_number: detail.contact_number,
            pick_up_point: detail.pick_up_point,
            meal_option: detail.meal_option,
            meal_option_id: detail.meal_option_id,
            watersports_option: detail.watersports_option,
            package_cost: detail.package_cost,
            discounted_package_cost: detail.discounted_package_cost,
          })),
        })),
      };

      console.log("Booking Payload:", payload);

      axios
        .post("/payments/", payload)
        .then((response) => {
          console.log("Booking successful:", response.data);

          const { order_id, razorpay_key_id, amount, balance_amount } =
            response.data;

          const options: RazorpayOptions = {
            key: razorpay_key_id,
            currency: "INR",
            name: "BlueDive Konkan Wonders",
            description: "",
            image: "icon.png",
            order_id: order_id,
            handler: function (response: any) {
              console.log(response);
              const bookingPayload = {
                ...payload,
                order_id,
                amount, // Include amount
                balance_amount, // Include balance_amount
                payments: [
                  {
                    payment_id: response.razorpay_payment_id,
                    order_id: response.razorpay_order_id,
                    signature: response.razorpay_signature,
                    amount: amount,
                    payment_method: "Razorpay",
                  },
                ],
              };

              // Send the booking payload to the /bookings/ endpoint
              axios
                .post("/bookings/", bookingPayload)
                .then((bookingResponse) => {
                  console.log("Booking confirmed:", bookingResponse.data);
                  // Navigate to the UserTour route without saving history
                  navigate(`/user-tour/${bookingResponse.data.id}`, {
                    replace: true,
                  });
                })
                .catch((bookingError) => {
                  console.error("Error confirming booking:", bookingError);
                });

              // Handle payment success
              // alert(response.razorpay_payment_id);
              // alert(response.razorpay_order_id);
              // alert(response.razorpay_signature)
            },
            prefill: {
              // "name": "Gaurav Kumar",
              // "email": "gaurav.kumar@example.com",
              // "contact": "9999999999"
            },
            notes: {},
            theme: {
              color: "#ef4444",
            },
          };

          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        })
        .catch((error) => {
          console.error("Error creating booking:", error);
        });
    } else {
      console.error("Please select a trip before proceeding to payment.");
    }
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

        setPaxOptions(packageData.pax_options || []);
        setTrips(packageData.trips || []);
        setWaterSportsOptions(packageData.water_sport_options || []);
        setPickupLocations(packageData.pickup_points || []);
        setMealOptions(packageData.meals || []);

        const initialValues = packageData.pax_options?.reduce(
          (acc: Record<string, number>, option: IPaxOptions) => {
            acc[option.pax] = 0;
            return acc;
          },
          {} as Record<string, number>
        );
        setValues(initialValues || {});

        // Set selectedTrip from location state or default to the first trip
        const initialSelectedTrip =
          location.state?.selectedTrip ||
          (packageData.trips && packageData.trips[0]) ||
          null;
        setSelectedTrip(initialSelectedTrip);

      })
      .catch((error) => {
        console.error("Error fetching data", error);
      });
  }, [package_name]);

  useEffect(() => {
    let payment_advance = 0;
    let payment_full = 0;

    if (paxRecords) {
      paxRecords.forEach((record) => {
        payment_advance += record.pax * paxAdvanceCost;

        record.customer_details.forEach((customer) => {
          payment_full += selectedTrip?.is_discount_applicable
            ? customer.discounted_package_cost
            : customer.package_cost;
        });
      });
    }

    setAdvanceAmount(payment_advance);
    setFullAmount(payment_full);
  }, [selectedTrip, paxRecords]);

  useEffect(() => {
    setSelectedPaymentOption("full");
  }, [selectedTrip]);

  useEffect(() => {
    if (userAuthenticated && paxRecords) {
      handlePayNow();
    }
  }, [userAuthenticated]);

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

              <div className="shadow p-4">
                <div className="flex flex-col">
                  <label className="font-medium">Trip Date:</label>

                  <div className="space-y-2 mt-4">
                    {trips.map((trip, index) => {
                      const start_day = moment(trip.start_date).format("DD");
                      const start_month = moment(trip.start_date).format("MMM");
                      const start_year = moment(trip.start_date).format("YY");

                      const end_day = moment(trip.end_date).format("DD");
                      const end_month = moment(trip.end_date).format("MMM");
                      const end_year = moment(trip.end_date).format("YY");

                      const isSelected = selectedTrip?.id === trip.id;

                      return (
                        <button
                          key={index}
                          onClick={() => setSelectedTrip(trip)}
                          className={`flex w-full justify-center gap-1 lg:gap-4 py-2 px-3 tracking-wide duration-500 text-base rounded-md
                          ${
                            isSelected
                              ? "border border-yellow-400 bg-red-500 text-white"
                              : "border border-red-500 text-red-500"
                          }`}
                        >
                          <div className="flex gap-1">
                            <div className="flex items-center gap-1">
                              <p className="text-lg font-bold">{start_day}</p>
                              <p className="text-xs">{start_month}</p>
                              <p className="text-xs">{start_year}</p>
                            </div>
                            <div>-</div>
                            <div className="flex items-center gap-1">
                              <p className="text-lg font-bold">{end_day}</p>
                              <p className="text-xs">{end_month}</p>
                              <p className="text-xs">{end_year}</p>
                            </div>
                          </div>
                          <div>|</div>
                          <div className="flex items-center gap-1">
                            <p
                              className={`text-lg font-bold
                                ${isSelected ? "text-yellow-400" : "text-black"}
                            `}
                            >
                              {trip.available_seats.toString().padStart(2, "0")}
                            </p>
                            <p className="text-xs">seats available</p>
                          </div>
                          <div>|</div>
                          <div className="flex items-center gap-1">
                            <p
                              className={`text-lg font-bold
                                ${isSelected ? "text-white-400" : "text-black"}
                            `}
                            >
                              {trip.available_rooms.toString().padStart(2, "0")}
                            </p>
                            <p className="text-xs">rooms available</p>
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
                    } flex flex-col items-center justify-center`}
                  >
                    {(selectedTrip?.is_scuba_free ||
                      selectedTrip?.is_discount_applicable) && (
                      <div className="text-center font-bold text-xl py-4 text-red-500">
                        Book your trip now to grab:
                      </div>
                    )}
                    <div className="flex flex-col lg:flex-row gap-2">
                      {selectedTrip?.is_discount_applicable && (
                        <div className="flex gap-2 px-2">
                          <FaTag className="size-16 text-red-500" />
                          <div>
                            <div className="font-bold w-full text-center">
                              Exclusive{" "}
                              <span className="px-1 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md">
                                20%
                              </span>{" "}
                              Discounts
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
                      {selectedTrip?.is_scuba_free &&
                        selectedTrip?.is_discount_applicable && (
                          <div className="text-center font-bold text-xl text-red-500">
                            {"&"}
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
                              On 100% payment before{" "}
                              <span className="text-red-600">
                                {moment(
                                  selectedTrip?.scuba_free_until_date
                                ).format("DD MMM YY")}
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="">
                    <span className="font-medium">Pax:</span>
                    <div className="flex flex-col lg:flex-row gap-4 mt-4">
                      {paxOptions.map((option) => (
                        <div className="w-full">
                          <li
                            className="inline-flex items-center  w-full py-2 shadow border border-blue-100 rounded px-2"
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
                                className="inline-flex items-center justify-center w-8 h-8 text-base font-semibold text-white bg-green-500 rounded"
                                onClick={() => handleIncrement(option.pax)}
                              >
                                +
                              </button>
                            </div>
                          </li>
                          {/* <span className="bg-red-500 text-white text-[12px] px-2.5 py-1 font-medium rounded-md h-5">
                            {option.discount}% OFF
                          </span> */}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4">
                {/* Render inputs for paxRecords */}
                {paxRecords.map((record) => (
                  <div key={record.id} className="mb-4">
                    <h6 className="text-xl font-semibold mb-2">
                      {record.pax} PAX:
                    </h6>
                    {record.customer_details.map((detail, index) => (
                      <div
                        key={index}
                        className="mb-4 p-4 border border-gray-200 rounded"
                      >
                        <h6 className="text-lg font-medium mb-2">
                          Customer {index + 1}
                        </h6>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          {/* Name */}
                          <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                              Name
                            </label>
                            <Input
                              type="text"
                              value={detail.name}
                              onChange={(e) =>
                                handleInputChange(
                                  record.id,
                                  index,
                                  "name",
                                  e.target.value
                                )
                              }
                              className="block w-full rounded px-2 py-1"
                            />
                          </div>

                          {/* Contact Number */}
                          <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                              Contact Number
                            </label>
                            <Input
                              type="text"
                              value={detail.contact_number}
                              onChange={(e) =>
                                handleInputChange(
                                  record.id,
                                  index,
                                  "contact_number",
                                  e.target.value
                                )
                              }
                              className="block w-fullrounded px-2 py-1"
                            />
                          </div>

                          {/* Pick Up Point */}
                          <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                              Pick Up Point
                            </label>
                            <Select
                              value={detail.pick_up_point}
                              onChange={(value) =>
                                handlePickupChange(record.id, index, value)
                              }
                              className="block w-fullrounded"
                            >
                              {pickupLocations.map((location) => (
                                <Option key={location.id} value={location.name}>
                                  {location.name}
                                </Option>
                              ))}
                            </Select>
                          </div>

                          {/* Watersports Option */}
                          <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                              Watersports Option
                            </label>
                            <Select
                              value={detail.watersports_option}
                              onChange={(value) =>
                                handleWaterSportChange(record.id, index, value)
                              }
                              className="block w-full rounded"
                            >
                              {waterSportsOptions.map((option) => (
                                <Option key={option.id} value={option.name}>
                                  {option.name}
                                </Option>
                              ))}
                            </Select>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          {/* Meal Option */}
                          <div className="mb-2">
                            <label className="block text-sm font-medium mb-1">
                              Meal Option
                            </label>
                            <Select
                              value={detail.meal_option}
                              onChange={(value) =>
                                handleInputChange(
                                  record.id,
                                  index,
                                  "meal_option",
                                  value
                                )
                              }
                              className="w-full"
                            >
                              {mealOptions.map((meal) => (
                                <Select.Option
                                  key={meal.name}
                                  value={meal.name}
                                >
                                  <div className="flex items-center gap-2">
                                    <span>{getIconByName(meal.name)}</span>
                                    <span>{meal.name}</span>
                                  </div>
                                </Select.Option>
                              ))}
                            </Select>

                            {/* <p className="text-slate-400">
                              {
                                mealOptions.find(
                                  (meal: IMeal) =>
                                    meal.name === detail.meal_option
                                )?.description
                              }
                            </p> */}
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {/* Display Package Cost and Discounted Price */}
                            <div className="mb-2">
                              <label className="block text-sm font-medium mb-1">
                                Package Cost
                              </label>
                              <p
                                className={`text-3xl ${
                                  selectedTrip?.is_discount_applicable
                                    ? "line-through"
                                    : ""
                                }`}
                              >
                                ₹ {detail.package_cost}
                              </p>
                            </div>
                            {selectedTrip?.is_discount_applicable && (
                              <div className="mb-2">
                                <label className="block text-sm font-medium mb-1">
                                  Discounted Cost
                                </label>
                                <p className="text-3xl text-red-500">
                                  ₹ {detail.discounted_package_cost}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="md:flex gap-4">
                          {packageDetails?.day_records?.map(
                            (day_record, index) => {
                              const food_records =
                                day_record?.day?.food_records?.find(
                                  (food_record) =>
                                    food_record.meal.name === detail.meal_option
                                );

                              return (
                                <div className="w-full">
                                  {
                                    <div className="shadow rounded-md p-2 flex flex-col h-full">
                                      <div className="p-1 font-bold">
                                        Day {index + 1}
                                      </div>
                                      {food_records &&
                                      food_records.meal_food_records &&
                                      food_records.meal_food_records.length >
                                        0 ? (
                                        food_records?.meal_food_records?.map(
                                          (meal_food_record) => (
                                            <div key={meal_food_record.id}>
                                              <div className="text-center font-dancing text-blue-600">
                                                {meal_food_record.meal_type}
                                              </div>
                                              <div className="flex flex-col">
                                                {meal_food_record.food_options.map(
                                                  (food_option) => (
                                                    <Badge
                                                      className="p-1"
                                                      key={food_option.id}
                                                    >
                                                      {" "}
                                                      {/* Use key for unique identification */}
                                                      {food_option.name}
                                                    </Badge>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )
                                      ) : (
                                        <div className="text-center text-gray-500 p-2">
                                          No meals for this day
                                        </div>
                                      )}
                                    </div>
                                  }
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar  */}
            <div className="lg:col-span-4 md:col-span-5">
              <div className="p-4 rounded-md shadow dark:shadow-gray-700 sticky top-24">
                <div>
                  <Radio.Group
                    onChange={handleRadioChange}
                    value={selectedPaymentOption}
                    className="flex flex-col gap-2"
                  >
                    {selectedTrip?.can_do_advance_payment && (
                      <div>
                        <Radio value="advance" className="font-bold text-lg">
                          PAY ADVANCE -{" "}
                          <span className="text-xl text-green-600">
                            {" "}
                            ₹ {formatNumber(advanceAmount)}{" "}
                          </span>
                        </Radio>
                        <div className="text-base text-slate-400">
                          You can pay the advance amount to partially confirm
                          your seat. You should pay the balance amount before{" "}
                          <span className="text-xl text-red-500">
                            {moment(
                              selectedTrip?.advance_payment_due_date
                            ).format("DD MMM YY")}
                          </span>
                        </div>
                      </div>
                    )}
                    <Radio value="full" className="font-bold text-lg">
                      PAY FULL -{" "}
                      <span className="text-xl text-green-600">
                        {" "}
                        ₹ {formatNumber(fullAmount)}{" "}
                      </span>
                    </Radio>
                    <div className="text-base text-slate-400">
                      Your seat will be confirmed
                    </div>
                  </Radio.Group>
                </div>
                <hr className="mt-2" />
                <div className="mt-4">
                  <button
                    onClick={userAuthenticated ? handlePayNow : showAuthModal}
                    className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md w-full"
                  >
                    Pay Now
                  </button>
                </div>
                {/* Packages */}
                <div className="mt-6 text-sm">
                  <div className="w-full text-left">
                    <div className="flex flex-col gap-4">
                      {paxOptions?.map((pax_option) => {
                        return (
                          <div>
                              <div className="w-full text-center bg-blue-800 text-white font-bold">
                                {pax_option.pax} PAX
                              </div>
                            <div className="flex w-full text-white bg-gray-600">
                              <div className="border px-2 py-1 w-3/4">Meal Type</div>
                              <div className="border px-2 py-1 w-3/4">Pkg. Cost</div>
                              <div className="border px-2 py-1 w-full">
                                20% Disc. Pkg.
                              </div>
                            </div>
                            <div className="">
                              {pax_option?.meal_records?.map((meal) => {
                                return (
                                  <div key={meal.id} className="flex">
                                    <div className="border px-2 py-1 w-3/4">
                                      {meal.meal.name}
                                    </div>
                                    <div className="border px-2 py-1 w-3/4">
                                      <span className="line-through text-red-600">
                                        ₹ {meal.price}
                                      </span>
                                    </div>
                                    <div className="border px-2 py-1 w-full">
                                      ₹ {meal.discounted_price}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
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
