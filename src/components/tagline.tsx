import {FiClock, FiMapPin, FiMail, FiFacebook, FiInstagram, FiPhone} from '../assets/icons/vander'

export default function Tagline(){
    return(
        <>
        <div className="tagline bg-slate-900">
            <div className="container relative">                
                <div className="grid grid-cols-1">
                    <div className="flex items-center justify-between">
                        <ul className="list-none space-x-2">
                            <li className="inline-flex items-center">
                                <FiClock className="text-red-500 size-4"></FiClock>
                                <span className="ms-2 text-slate-300">Mon-Sat: 9am to 6pm</span>
                            </li>
                            <li className="inline-flex items-center ms-2">
                                <FiMapPin className="text-red-500 size-4"></FiMapPin>
                                <span className="ms-2 text-slate-300">Pune-411019, Maharashtra</span>
                            </li>
                        </ul>

                        <ul className="list-none">
                            <li className="inline-flex items-center">
                                <FiMail className="text-red-500 size-4"></FiMail>
                                <a href="mailto:contact@bluedive.in" className="ms-2 text-slate-300 hover:text-slate-200">contact@bluedive.in</a>
                            </li>
                            <li className="inline-flex items-center ms-2">
                                <ul className="list-none space-x-3">
                                    <li className="inline-flex mb-0"><a href="#!" className="text-slate-300 hover:text-red-500"><FiFacebook className="size-4 align-middle" title="facebook"></FiFacebook></a></li>
                                    <li className="inline-flex ms-2 mb-0"><a href="https://www.instagram.com/bluedive_konkan_wonders?igsh=MTJ3dmk4Z3JsenpzcA%3D%3D&utm_source=qr" className="text-slate-300 hover:text-red-500"><FiInstagram className="size-4 align-middle" title="instagram"></FiInstagram></a></li>
                                    {/* <li className="inline-flex ms-2 mb-0"><a href="#!" className="text-slate-300 hover:text-red-500"><FiTwitter className="size-4 align-middle" title="twitter"></FiTwitter></a></li> */}
                                    <li className="inline-flex ms-2 mb-0"><a href="tel:+152534-468-854" className="text-slate-300 hover:text-red-500"><FiPhone className="size-4 align-middle" title="phone"></FiPhone></a></li>
                                </ul>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}