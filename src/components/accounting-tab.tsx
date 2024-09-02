import { Link } from "react-router-dom";

import { FiSettings, FiLogOut, FiCompass } from "../assets/icons/vander";
import { IUserData } from "../types/user.types";
import { Context } from "../context/context.provider";
import { confirmation } from "./confirmation";

export default function AccountingTab() {
  let current = window.location.pathname;
  const { signOutUser } = Context();

  const handleSignOut = async () => {
    const confirmed = await confirmation('Are you sure you want to sign out?');

    if (confirmed) {
      signOutUser(); 
      window.location.href = '/';  // Redirect to the home page
    }
  };

  const user_data: IUserData = JSON.parse(
    localStorage.getItem("bluedive-user-data") || "{}"
  );

  return (
    <div className="lg:w-1/4 md:w-1/3 md:px-3">
      <div className="relative md:-mt-48 -mt-32">
        <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
          <div className="profile-pic text-center mb-5">
            <div>
              <div>
                <h5 className="text-lg font-semibold">
                  {user_data.first_name
                    ? user_data.first_name + " " + user_data.last_name
                    : user_data.username}
                </h5>
                <p className="text-slate-400">Welcome</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700">
            <ul className="list-none sidebar-nav mb-0 pb-0" id="navmenu-nav">
              <li
                className={`navbar-item account-menu ${
                  current === "/user-profile" ? "active" : ""
                }`}
              >
                <Link
                  to="/user-profile"
                  className="navbar-link text-slate-400 flex items-center py-2 rounded"
                >
                  <span className="me-2 mb-0">
                    <FiCompass className="size-4"></FiCompass>
                  </span>
                  <h6 className="mb-0 font-medium">My Tours</h6>
                </Link>
              </li>

              <li
                className={`navbar-item account-menu ${
                  current === "/user-setting" ? "active" : ""
                }`}
              >
                <Link
                  to="/user-setting"
                  className="navbar-link text-slate-400 flex items-center py-2 rounded"
                >
                  <span className="me-2 mb-0">
                    <FiSettings className="size-4"></FiSettings>
                  </span>
                  <h6 className="mb-0 font-medium">Settings</h6>
                </Link>
              </li>

              <li
                className={`navbar-item account-menu ${
                  current === "/lock-screen" ? "active" : ""
                }`}
              >
                <button
                  onClick={handleSignOut}
                  className="navbar-link text-slate-400 flex items-center py-2 rounded"
                >
                  <span className="me-2 mb-0">
                    <FiLogOut className="size-4"></FiLogOut>
                  </span>
                  <h6 className="mb-0 font-medium">Sign Out</h6>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
