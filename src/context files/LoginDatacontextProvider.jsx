import React, { createContext, useContext, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

const LoginData = createContext();

export function useMyContext() {
  return useContext(LoginData);
};



export default function LoginDatacontextProvider() {
  const profile =JSON.parse(localStorage.getItem('profile'));
  const role = localStorage.getItem('role');
  const permissions=JSON.parse(localStorage.getItem('permissions'))
  const userInfo={profile,permissions};
  const [loginData, setLoginData] = useState(userInfo);
 
  const updateLoginData = (accessibility) => {
    setLoginData({accessibility});
  };

  return (
    <LoginData.Provider value={{loginData,updateLoginData}}>
      <Outlet />
    </LoginData.Provider>
  );
}