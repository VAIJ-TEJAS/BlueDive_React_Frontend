import Navbar from "../components/navbar";
import Footer from "../components/footer";

import axios from "../api/axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ITour } from "../types/tours.types";
import { FiClock } from "react-icons/fi";
import { IPackage } from "../types/package.types";
import { IPaxRecord } from "../types/booking-form.types";
import { RazorpayOptions } from "../types/razorpay";

export default function UserTour() {
  const [booking, setBooking] = useState<ITour | null>(null);
  const [paxRecords, setPaxRecords] = useState<IPaxRecord[]>([]);
  const [packageDetails, setPackageDetails] = useState<IPackage | null>(null);
  const { id } = useParams(); // Get the id from URL params

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        // Make the GET request to fetch the specific booking by id
        const response = await axios.get(`/bookings/${id}/`);

        console.log(response.data);
        // Set the response data to the state
        setBooking(response.data);
        setPaxRecords(response.data.pax_records);
        setPackageDetails(response.data.trip.package);
      } catch (err) {
        // Handle any errors
        console.log(err);
      }
    };

    if (id) {
      fetchBooking();
    }
  }, [id]);

  const handlePayment = async () => {
    if (!booking) return;

    try {
      // Create a payment order on the server
      const orderResponse = await axios.post("/balance-payments/", {
        booking_id: booking.id,
      });

      const { order_id, razorpay_key_id, amount } = orderResponse.data;

      const options: RazorpayOptions = {
        key: razorpay_key_id, // Replace with your Razorpay key
        currency: "INR",
        name: "BlueDive Konkan Wonders",
        description: "Balance Payment",
        order_id: order_id,
        handler: async function (response: any) {
          console.log(response);
          try {
            // Confirm the booking after payment verification
            const bookingConfirmationResponse = await axios.post(`/bookings/${booking.id}/confirm/`,
              {
                payment: {
                  payment_id: response.razorpay_payment_id,
                  order_id: response.razorpay_order_id,
                  signature: response.razorpay_signature,
                  amount: amount,
                  payment_method: "Razorpay",
                },
              }
            );

            if (bookingConfirmationResponse.status === 200) {
              window.location.reload();
              console.log(
                "Booking confirmed:",
                bookingConfirmationResponse.data
              );
            } else {
              console.log("Failed to confirm booking");
            }
          } catch (error) {
            console.error("Error during payment processing:", error);
          }
        },
        prefill: {
          // name: "Customer Name",
          // email: "customer@example.com",
          // contact: "9999999999",
        },
        notes: {},
        theme: {
          color: "#ef4444",
        },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      // Handle any errors
      console.log(err);
    }
  };

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

        <div className="container relative md:mt-12 mt-8">
          <div className="md:mb-12 mb-8 p-4 flex flex-col gap-4 rounded-md shadow dark:shadow-gray-700">
            <div>
              <h6 className="text-lg font-semibold">Balance Amount: </h6>
              <p className="text-xl font-bold text-red-500">
                ₹{booking?.balance_amount}
              </p>
              <button
                onClick={handlePayment}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Pay Balance
              </button>
            </div>
          </div>
          <div className="">
            <span className="bg-red-500 text-white text-[12px] px-2.5 py-1 font-medium rounded-md h-5">
              {booking?.status}
            </span>
            <h5 className="text-2xl font-semibold">{packageDetails?.name}</h5>
            <p className="flex items-center text-slate-400 font-medium mt-2">
              <FiClock className="text-red-500 size-4 me-1" />{" "}
              {packageDetails?.duration}
            </p>

            <div className="mt-6">
              <h5 className="text-xl font-semibold  mb-6 text-sky-500">
                Customers
              </h5>

              {paxRecords.length > 0 ? (
                paxRecords.map((paxRecord) => (
                  <div key={paxRecord.id} className="mb-4">
                    <h6 className="text-lg font-semibold">
                      Pax: {paxRecord.pax}
                    </h6>
                    <div className="grid grid-cols-2 gap-2">
                      {paxRecord.customer_details.map((customer, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-md border border-gray-300 dark:border-gray-700"
                        >
                          <p className="text-slate-600 dark:text-slate-300">
                            <strong>Name:</strong> {customer.name}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">
                            <strong>Contact:</strong> {customer.contact_number}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">
                            <strong>Pick-up Point:</strong>{" "}
                            {customer.pick_up_point}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">
                            <strong>Meal Option:</strong> {customer.meal_option}
                          </p>
                          <p className="text-slate-600 dark:text-slate-300">
                            <strong>Watersports Option:</strong>{" "}
                            {customer.watersports_option}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p>No customers found for this booking.</p>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
