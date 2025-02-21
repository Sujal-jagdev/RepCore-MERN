import React, { createContext, useState } from 'react'

export const MyContext = createContext();
export const API = `http://localhost:3000`;

const AllContext = ({ children }) => {
  const [product, setproduct] = useState([])
  const [API, setAPI] = useState(`http://localhost:3000`)
  return (
    <MyContext.Provider value={{product, setproduct,
      API
    }}>{children}</MyContext.Provider>
  )
}

export default AllContext