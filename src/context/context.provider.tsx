import React, {
  createContext,
  useState,
  ReactNode,
  useContext,
} from "react";
import { IAuthResponse } from "../types/user.types";

// Create the context
const MyContext = createContext<any | undefined>(undefined);

// Create a provider component
export const MyContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [userAuthenticated, setUserAuthenticated] = useState<boolean>(!!localStorage.getItem("bluedive-token"));
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const signInUser = (authData: IAuthResponse) => {
    localStorage.setItem("bluedive-token", authData.token);
    setUserAuthenticated(true);
    // You can also store user details if needed
    localStorage.setItem("bluedive-user-data", JSON.stringify(authData.user));
  };
  
  const signOutUser = () => {
    localStorage.removeItem("bluedive-token");
    localStorage.removeItem("bluedive-user-data");
    setUserAuthenticated(false);
  };

  const showAuthModal = () => {
    setAuthModalOpen(true);
  };

  const hideAuthModal = () => {
    setAuthModalOpen(false);
  };

  const contextValue: any = {
    userAuthenticated,
    setUserAuthenticated,
    signInUser,
    signOutUser,
    showAuthModal,
    hideAuthModal,
    authModalOpen,
    setAuthModalOpen,
  };

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
};

// Create a custom hook to use the context
export const Context = (): any => {
  const context = useContext(MyContext);
  if (!context) {
    throw new Error("useMyContext must be used within a MyContextProvider");
  }
  return context;
};
