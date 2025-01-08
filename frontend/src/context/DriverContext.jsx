import React, { createContext } from 'react'
import { useState } from 'react';

export const  DriverDataContext = createContext();

const DriverContext = ({children}) => {
  
  const [driver,setDriver] = useState({
    "email":"",
    "fullName" :{
        "firstName":"",
        "lastName":""
    },
    "vehicle":{
      "color":"",
      "plate":"",
      "capacity":"",
      "vehicleType":""
    }
  });
  return (
    <div>
      <DriverDataContext.Provider value={{driver,setDriver}}>
        {children}
      </DriverDataContext.Provider>
    </div>
  )
}

export default DriverContext
