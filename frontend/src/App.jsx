import React from 'react'
import { Route, Routes } from "react-router-dom"
import { v4 as uuidv4 } from 'uuid';
import UserLogin from './screens/UserLogin'
import UserSignUp from './screens/UserSignUp'
import DriverLogin from './screens/DriverLogin'
import DriverSignUp from './screens/DriverSignUp'
import Start from './screens/Start'
import UserProtectedWrapper from './screens/UserProtectedWrapper'
import UserHome from './screens/UserHome'
import DriverHome from './screens/DriverHome'
import DriverWrapper from './screens/DriverProtectedWrapper'
import UserTrackOrders from './screens/UserTrackOrders'
import UserManageProfile from './screens/UserManageProfile'
import DriverManageProfile from './screens/DriverManageProfile'

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Start />} />

      <Route path='/user-login' element={<UserLogin />} />
      <Route path='/user-signup' element={<UserSignUp />} />
      <Route path='/user-home' element={
        <UserProtectedWrapper>
          <UserHome />
        </UserProtectedWrapper>}
      />
      <Route path='/user-track-orders' element={
        <UserProtectedWrapper>
          <UserTrackOrders />
        </UserProtectedWrapper>}
      />
      <Route path='/user-manage-profile' element={
        <UserProtectedWrapper>
          <UserManageProfile />
        </UserProtectedWrapper>}
      />


      <Route path='/driver-login' element={<DriverLogin />} />
      <Route path='/driver-signup' element={<DriverSignUp />} />
      <Route path='/driver-home' element={
        <DriverWrapper>
          <DriverHome />
        </DriverWrapper>}
      />
      <Route path='/driver-manage-profile' element={
        <DriverWrapper>
          <DriverManageProfile/>
        </DriverWrapper>
      }
      />
    </Routes>
  )
}

export default App
