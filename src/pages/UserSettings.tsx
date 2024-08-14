import Navbar from "../components/navbar";
import AccountingTab from "../components/accounting-tab";
import Footer from "../components/footer";

import { FiUser, FiUserCheck } from "../assets/icons/vander";
import { IUserData } from "../types/user.types";
import { useState } from "react";
import axios from "../api/axios";
import { Context } from "../context/context.provider";
import { message } from "antd";

export default function UserSetting() {
  const { signInUser } = Context();

  const user_data: IUserData = JSON.parse(
    localStorage.getItem("bluedive-user-data") || "{}"
  );

  const [firstName, setFirstName] = useState(user_data.first_name || "");
  const [lastName, setLastName] = useState(user_data.last_name || "");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const firstName = event.currentTarget.firstname.value;
    const lastName = event.currentTarget.lastname.value;

    try {
      const response = await axios.post("/user/update_profile/", {
        first_name: firstName,
        last_name: lastName,
      });

      signInUser(response.data);

      message.success('User details updated successfully!');

      window.location.reload();
      
    } catch (error) {
      console.error("Error updating user details:", error);
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

        <div className="container relative md:mt-24 mt-16">
          <div className="md:flex">
            <AccountingTab />
            <div className="lg:w-3/4 md:w-2/3 md:px-3 mt-6 md:mt-0">
              <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900">
                <h5 className="text-lg font-semibold mb-4">
                  Personal Detail :
                </h5>
                <form onSubmit={handleSubmit}>
                  <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
                    <div>
                      <label className="form-label font-medium">
                        First Name :
                      </label>
                      <div className="form-icon relative mt-2">
                        <FiUser className="w-4 h-4 absolute top-3 start-4"></FiUser>
                        <input
                          value={firstName}
                          onChange={(e) => {
                            setFirstName(e.target.value);
                          }}
                          type="text"
                          className="ps-12 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="First Name:"
                          id="firstname"
                          name="firstname"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="form-label font-medium">
                        Last Name :
                      </label>
                      <div className="form-icon relative mt-2">
                        <FiUserCheck className="w-4 h-4 absolute top-3 start-4"></FiUserCheck>
                        <input
                          value={lastName}
                          onChange={(e) => {
                            setLastName(e.target.value);
                          }}
                          type="text"
                          className="ps-12 w-full py-2 px-3 h-10 bg-transparent dark:bg-slate-900 dark:text-slate-200 rounded outline-none border border-gray-100 dark:border-gray-800 focus:ring-0"
                          placeholder="Last Name:"
                          id="lastname"
                          name="lastname"
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="submit"
                    name="send"
                    className="py-2 px-5 inline-block font-semibold tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md mt-5"
                  >
                    Save Changes
                  </button>
                </form>
              </div>

              {/* <div className="p-6 rounded-md shadow dark:shadow-gray-800 bg-white dark:bg-slate-900 mt-6">
                <h5 className="text-lg font-semibold mb-5 text-red-600">
                  Delete Account :
                </h5>

                <p className="text-slate-400 mb-4">
                  Do you want to delete the account? Please press below "Delete"
                  button
                </p>

                <Link
                  to=""
                  className="py-2 px-5 inline-block font-semibold tracking-wide align-middle duration-500 text-base text-center bg-red-600 text-white rounded-md"
                >
                  Delete
                </Link>
              </div> */}

            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
