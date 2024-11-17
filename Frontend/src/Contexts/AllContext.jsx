import React, { createContext, useState } from 'react'

export const MyContext = createContext();
const AllContext = ({ children }) => {
  const [product, setproduct] = useState([])
  return (
    <MyContext.Provider value={{product, setproduct}}>{children}</MyContext.Provider>
  )
}

export default AllContext