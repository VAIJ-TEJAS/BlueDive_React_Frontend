import React from "react";
import { Link } from "react-router-dom";
import { FiClock } from "react-icons/fi";
import { IPackage } from "../types/package.types";

interface PackageCardProps {
  item: IPackage;
}

const PackageCard: React.FC<PackageCardProps> = ({ item }) => {
  return (
    <div className="group rounded-md shadow dark:shadow-gray-700">
      <div className="relative overflow-hidden rounded-t-md shadow dark:shadow-gray-700 mx-3 mt-3">
        <img
          src={item.cover_image}
          className="scale-125 group-hover:scale-100 duration-500"
          alt={"Package"}
        />
        {item.display_discount_percentage && (
          <div className="absolute top-0 start-0 p-4">
            <span className="bg-red-500 text-white text-[12px] px-2.5 py-1 font-medium rounded-md h-5">
              {item.display_discount_percentage}
              % OFF
            </span>
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="flex items-center text-slate-400 font-medium mb-2">
          <FiClock className="text-red-500 size-4 me-1" /> {item.duration}
        </p>
        <Link
          to={`/package/${item.name}`}
          className="text-lg font-medium hover:text-red-500 duration-500 ease-in-out"
        >
          {item.name}
        </Link>

        <p className="text-slate-400 pt-2">{item.description}</p>

        <div className="mt-4 pt-4 flex justify-between items-center border-t border-slate-100 dark:border-gray-800">
          <h5 className="text-lg font-medium text-red-500">
            ₹ {item.display_price}
          </h5>

          <Link to={`/package/${item.name}`} className="py-2 px-5 inline-block tracking-wide align-middle duration-500 text-base text-center bg-red-500 text-white rounded-md">
            Book Now <i className="mdi mdi-arrow-right"></i>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PackageCard;
