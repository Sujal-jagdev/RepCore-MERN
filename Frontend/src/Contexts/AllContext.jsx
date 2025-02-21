import React, { createContext, useState } from 'react'

export const MyContext = createContext();
export const API = `http://localhost:3000`;

const AllContext = ({ children }) => {
  const [product, setproduct] = useState([])

  return (
    <MyContext.Provider value={{product, setproduct
    }}>{children}</MyContext.Provider>
  )
}

export default AllContext
