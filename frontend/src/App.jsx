import React, { useState } from "react";
import MainRoutes from "./components/Routing/MainRoutes";
import {BrowserRouter as Router } from "react-router-dom";
import { registeredContext, uniqueIdContext } from "./components/Context/Context";

export default function App() {

  const [registered, setRegistered] = useState(false);
  const [mainId, setMainId] = useState('');

  return (
   <>
      <registeredContext.Provider value={{registered, setRegistered}}>
        <uniqueIdContext.Provider value={{mainId, setMainId}}>
            <Router>
                <MainRoutes />
            </Router>
        </uniqueIdContext.Provider>
      </registeredContext.Provider>
   </>
  );
}
