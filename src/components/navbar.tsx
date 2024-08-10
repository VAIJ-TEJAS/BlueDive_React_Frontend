import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import logoDark from "../assets/images/logo-dark.png";
import logoLight from "../assets/images/logo-light.png";
// import logoWhite from "../assets/images/logo-white.png";
import userImg from "../assets/images/client/16.jpg";

import {
  FiUser,
  FiSettings,
  FiLogOut,
} from "../assets/icons/vander";

interface NavbarProps {
  navclass: string;
  navlight: boolean;
  manuclass: string;
}

export default function Navbar({ navclass, navlight, manuclass }: NavbarProps) {
  let [scrolling, setScrolling] = useState(false);
  let [manu, setManu] = useState("");
  let [userManu, setUserManu] = useState(false);

  let userRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolling = window.scrollY > 50;
      setScrolling(isScrolling);
    };


    const userOutsideClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setUserManu(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("click", userOutsideClick);

    let current = window.location.pathname;
    setManu(current);
    window.scrollTo(0, 0);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("click", userOutsideClick);
    };
  }, []);

//   const toggleMenu = () => {
//     setToggle(!isToggle);
//   };

  return (
    <nav id="topnav" className={`${navclass} ${scrolling ? "nav-sticky" : ""}`}>
      <div className="container relative flex justify-between">
        {navlight && (
          <Link className="logo" to="/">
            <span className="inline-block">
              <img src={logoDark} className="h-12 l-dark" alt="" />
              <img src={logoLight} className="h-12 l-light" alt="" />
            </span>
            {/* <img src={logoWhite} className="hidden" alt="" /> */}
          </Link>
        )}
        {!navlight && (
          <Link className="logo" to="/">
            <div>
              <img src={logoDark} className="h-12 inline-block" alt="" />
              {/* <img src={logoWhite} className="h-7 hidden" alt="" /> */}
            </div>
          </Link>
        )}

        <div className="flex">
          <div
            id="navigation"
            
          >
            <ul className={`navigation-menu ${manuclass}`}>

            <li className={`${manu === "/tour-packages" ? "active" : ""}`}>
                <Link to="/tour-packages" className="sub-menu-item">
                  Packages
                </Link>
              </li>

              <li className={`${manu === "/aboutus" ? "active" : ""}`}>
                <Link to="/aboutus" className="sub-menu-item">
                  About Us
                </Link>
              </li>

              <li className={`${manu === "/contact" ? "active" : ""}`}>
                <Link to="/contact" className="sub-menu-item">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <ul className="buy-button list-none mb-0 space-x-1">
            <li className="dropdown inline-block relative ps-0.5" ref={userRef}>
              <button
                className="dropdown-toggle items-center"
                type="button"
                onClick={() => setUserManu(!userManu)}
              >
                <span className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center rounded-md border border-red-500 bg-red-500 text-white">
                  <img src={userImg} className="rounded-md" alt="" />
                </span>
              </button>
              {userManu && (
                <div className="dropdown-menu absolute end-0 m-0 mt-4 z-10 w-48 rounded-md overflow-hidden bg-white dark:bg-slate-900 shadow dark:shadow-gray-800 ">
                  <ul className="py-2 text-start">
                    <li>
                      <Link
                        to="/user-profile"
                        className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-red-500 dark:hover:text-white"
                      >
                        <FiUser className="size-4 me-2"></FiUser>Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/user-setting"
                        className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-red-500 dark:hover:text-white"
                      >
                        <FiSettings className="size-4 me-2"></FiSettings>
                        Settings
                      </Link>
                    </li>
                    <li className="border-t border-gray-100 dark:border-gray-800 my-2"></li>
                    <li>
                      <Link
                        to="/login"
                        className="flex items-center font-medium py-2 px-4 dark:text-white/70 hover:text-red-500 dark:hover:text-white"
                      >
                        <FiLogOut className="size-4 me-2"></FiLogOut>Logout
                      </Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
