import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import AllContext from './Contexts/AllContext.jsx'
import { Provider } from 'react-redux'
import { store } from './Redux/Store.js'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <BrowserRouter>
      <AllContext>
        <App />
      </AllContext>
    </BrowserRouter>,
  </Provider>
)
