//DriverContext.js

import React, { createContext, useState } from 'react';

export const DriverContext = createContext();

export const DriverProvider = ({ children }) => {
  const [driverDetails, setDriverDetails] = useState({
    name: '',
    email: '',
    contact: [],
    vehicleNumber: '',
    profilePicture: null,
  });

  return (
    <DriverContext.Provider value={{ driverDetails, setDriverDetails }}>
      {children}
    </DriverContext.Provider>
  );
};