import { Link } from "react-router-dom";

import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function Terms() {
  return (
    <>
      <Navbar
        navclass="defaultscroll is-sticky"
        navlight={false}
        manuclass="justify-end"
      />

      <section className="relative table w-full py-32 lg:py-40 bg-gray-50 dark:bg-slate-800">
        <div className="container relative">
          <div className="grid grid-cols-1 text-center mt-10">
            <h3 className="text-3xl leading-normal font-semibold">
              Terms of Services
            </h3>
          </div>
        </div>

        <div className="absolute text-center z-10 bottom-5 start-0 end-0 mx-3">
          <ul className="tracking-[0.5px] mb-0 inline-block">
            <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-red-500">
              <Link to="/">Bluedive</Link>
            </li>
            <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180">
              <i className="mdi mdi-chevron-right"></i>
            </li>
            <li className="inline-block uppercase text-[13px] font-bold duration-500 ease-in-out hover:text-red-500">
              <Link to="">Utility</Link>
            </li>
            <li className="inline-block text-base text-slate-950 dark:text-white mx-0.5 ltr:rotate-0 rtl:rotate-180">
              <i className="mdi mdi-chevron-right"></i>
            </li>
            <li
              className="inline-block uppercase text-[13px] font-bold text-red-500"
              aria-current="page"
            >
              Terms
            </li>
          </ul>
        </div>
      </section>

      <section className="relative md:py-24 py-16">
        <div className="container relative">
          <div className="md:flex justify-center">
            <div className="md:w-3/4">
              <div className="p-6 bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 rounded-md">
                {/* <h5 className="text-xl font-semibold mb-4">Introduction :</h5>
                            <p className="text-slate-400">It seems that only fragments of the original text remain in the Lorem Ipsum texts used today. One may speculate that over the course of time certain letters were added or deleted at various positions within the text.</p>

                            <h5 className="text-xl font-semibold mb-4 mt-8">User Agreements :</h5>
                            <p className="text-slate-400">The most well-known dummy text is the 'Lorem Ipsum', which is said to have <b className="text-red-600">originated</b> in the 16th century. Lorem Ipsum is <b className="text-red-600">composed</b> in a pseudo-Latin language which more or less <b className="text-red-600">corresponds</b> to 'proper' Latin. It contains a series of real Latin words. This ancient dummy text is also <b className="text-red-600">incomprehensible</b>, but it imitates the rhythm of most European languages in Latin script. The <b className="text-red-600">advantage</b> of its Latin origin and the relative <b className="text-red-600">meaninglessness</b> of Lorum Ipsum is that the text does not attract attention to itself or distract the viewer's <b className="text-red-600">attention</b> from the layout.</p>
                            <p className="text-slate-400 mt-3">There is now an <b className="text-red-600">abundance</b> of readable dummy texts. These are usually used when a text is <b className="text-red-600">required purely</b> to fill a space. These alternatives to the classic Lorem Ipsum texts are often amusing and tell short, funny or <b className="text-red-600">nonsensical</b> stories.</p>
                            <p className="text-slate-400 mt-3">It seems that only <b className="text-red-600">fragments</b> of the original text remain in the Lorem Ipsum texts used today. One may speculate that over the course of time certain letters were added or deleted at various positions within the text.</p> */}

                <h5 className="text-xl font-semibold mb-4">
                  Cancellations & Refunds:
                </h5>
                <p className="text-slate-400">
                  We understand that sometimes plans change. Our refund and
                  cancellation policy is designed to be fair and transparent
                </p>
                <ul className="list-none text-slate-400 mt-3">
                  <li className="mt-2">
                    <i className="mdi mdi-chevron-right text-red-500 text-lg align-middle me-2"></i>
                    Cancellation Policy
                    <div className="ml-4 flex gap-2">
                      <div>1.</div>
                      <div>
                        25% of the booking amount of Rs.2500 will not be
                        refunded by BlueDive team for cancellations done 15 days
                        prior to the scheduled journey / trip -. Apart from 25%
                        of booking amount, balance amount will be refunded
                      </div>
                    </div>
                    <div className="ml-8">
                      Example - If the Trip / Journey Start date is 08th
                      November 2024 and the cancellation is made on OR before
                      24th October 2024 then 25% of the booking amount Rs. 500/-
                      out of Rs. 2500/- will not be refunded. This is applicable
                      for Payment made in full or only booking amount is paid.
                    </div>
                    <div className="ml-4 flex gap-2">
                      <div>2.</div>
                      <div>
                        50% of the booking amount of Rs.2500 will not be
                        refunded by BlueDive team for cancellations done between
                        10 to 14 days prior to the scheduled journey / trip -
                        Apart from 50% of booking amount, balance amount will be
                        refunded. This is applicable for Payment made in full or
                        only booking amount is paid.
                      </div>
                    </div>
                    <div className="ml-8">
                      Example - If the Trip / Journey Start date is 08th
                      November 2024 and the cancellation is made on OR between
                      25th October 2024 to 29th October 2024 then 50% of the
                      booking amount Rs. 1250/- out of Rs. 2500/- will not be
                      refunded. This is applicable for Payment made in full or
                      only booking amount is paid.
                    </div>
                    <div className="ml-4 flex gap-2">
                      <div>3.</div>
                      <div>
                        Booking amount of Rs.2500/- will not be refunded in case
                        the booking is cancelled between journey date and 9 days
                        prior to the trip/journey date.
                      </div>
                    </div>
                    <div className="ml-8">
                      Example - If the Trip / Journey Start date is 08th
                      November 2024 and the cancellation is made on OR between
                      30th October 2024 to 07th November 2024 then booking
                      amount Rs. 2500/- will not be refunded. This is applicable
                      for Payment made in full or only booking amount is paid.
                    </div>
                  </li>
                  <li className="mt-2">
                    <i className="mdi mdi-chevron-right text-red-500 text-lg align-middle me-2"></i>
                    Refund Policy
                    <div className="ml-4 flex gap-2">
                      <div>1.</div>
                      <div>
                        Refunds will be processed within 7 to 10 business days
                        post the Journey End date.
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <div>2.</div>
                      <div>
                        Refunds will be issued through original payment method.
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <div>3.</div>
                      <div>
                        No Refunds will be made in case the journey is cancelled
                        on the Trip / Journey date.
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <div>4.</div>
                      <div>
                        100% refund will be given in case the planned Trip /
                        Journey is cancelled by BlueDive team due to any
                        unavoidable situations.
                      </div>
                    </div>
                  </li>
                  <li className="mt-2">
                    <i className="mdi mdi-chevron-right text-red-500 text-lg align-middle me-2"></i>
                    Exceptions: No refunds will be issued for:
                    <div className="ml-4 flex gap-2">
                      <div>1.</div>
                      <div>
                      No-shows or late arrivals
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <div>2.</div>
                      <div>
                      Cancellations due to natural disasters, acts of God, or unforeseen circumstances
                      </div>
                    </div>
                  </li>
                  <li className="mt-2">
                    <i className="mdi mdi-chevron-right text-red-500 text-lg align-middle me-2"></i>
                    How to Cancel: To cancel, please contact us at:
                    <div className="ml-4 flex gap-2">
                      <div>1.</div>
                      <div>
                      Phone: +91 8668904446
                      </div>
                    </div>
                    <div className="ml-4 flex gap-2">
                      <div>2.</div>
                      <div>
                      Email: contact@bluedive.in
                      </div>
                    </div>
                  </li>
                </ul>

                {/* <h5 className="text-xl font-semibold mt-8">Users Question & Answer :</h5> */}

                {/* <div className="mt-6">
                                {faqData.map((item,index)=>{
                                    return(
                                        <div className="relative shadow dark:shadow-gray-800 rounded-md overflow-hidden mt-4" key={index}>
                                            <h2 className="text-base font-semibold">
                                                <button type="button" className={`flex justify-between items-center p-5 w-full font-medium text-start ${activeTab === item.id ? 'bg-gray-50 dark:bg-slate-800 text-red-500' : ''}`} onClick={()=>setActiveTab(item.id)}>
                                                    <span>{item.title}</span>
                                                    <FiChevronUp className={`size-4 shrink-0 ${activeTab === item.id ? '' : 'rotate-180'}`}></FiChevronUp>
                                                </button>
                                            </h2>
                                            <div className={activeTab === item.id ? '' : 'hidden'}>
                                                <div className="p-5">
                                                    <p className="text-slate-400 dark:text-gray-400">{item.desc}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div> */}

                {/* <div className="mt-6">
                                <Link to="" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-red-500 hover:bg-red-600 border-red-500 hover:border-red-600 text-white rounded-md">Accept</Link>
                                <Link to="" className="py-2 px-5 inline-block font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-transparent hover:bg-red-500 border-red-500 text-red-500 hover:text-white rounded-md ms-2">Decline</Link>
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
