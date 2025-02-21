import React, { createContext, useState } from 'react'

export const MyContext = createContext();
export const API = `http://localhost:3000`;

const AllContext = ({ children }) => {
  const [product, setproduct] = useState([])
  const [API, setAPI] = useState(`https://repcore-mern.onrender.com`)
  return (
    <MyContext.Provider value={{product, setproduct,
      API
    }}>{children}</MyContext.Provider>
  )
}

export default AllContext