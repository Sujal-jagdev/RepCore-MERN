import React, { createContext, useState } from 'react'

export const MyContext = createContext();
export const API = `https://repcore-mern.onrender.com`;

const AllContext = ({ children }) => {
  const [product, setproduct] = useState([])

  return (
    <MyContext.Provider value={{product, setproduct
    }}>{children}</MyContext.Provider>
  )
}

export default AllContext
