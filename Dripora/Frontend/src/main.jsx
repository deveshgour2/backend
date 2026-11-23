import { StrictMode } from 'react'
import App from './app/App.jsx'
import { createRoot } from 'react-dom/client'
import { store } from './app/app.store.js'
import { Provider } from 'react-redux'

createRoot(document.getElementById('root')).render(
 
    <Provider store={store}>
        <App />
    </Provider>
 
)
