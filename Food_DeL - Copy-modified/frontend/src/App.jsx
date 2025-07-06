
import React , { useState }from 'react'
import Navbar from './pages/Navbar/Navbar';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder';
import Footer from './components/Footer/Footer';
import LoginPopup from'./components/LoginPopup/LoginPopup';
import Verify from './pages/Verify/Verify';
import MyOrders from './pages/MyOrders/MyOrders'

import PaymentSuccess from './pages/PaymentSuccess';
import PaymentCancel from './pages/PaymentCancel';
import PaymentFail from './pages/PaymentFail';
import ChatBot from './components/ChatBot/ChatBot';
const App = () => {

  const [showLogin,setShowLogin]=useState(false)

  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    <div className='app'>
      <Navbar setShowLogin={setShowLogin}/>  
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/order' element={<PlaceOrder/>}/>
        <Route path='/verify' element={<Verify />} />
        <Route path='/myorder' element={<MyOrders />} />
        
        <Route path='/order/success' element={<PaymentSuccess />} />
        <Route path='/order/cancel' element={<PaymentCancel />} />
        <Route path='/order/fail' element={<PaymentFail />} />
      </Routes>
    </div>
    <ChatBot/>
    <Footer/>
    </>
  )
}

export default App;