import React from "react";
import { Outlet } from "react-router-dom";
import HomeNav from "./HomeNav";

function HomeNavWrapper() {
  return (
    <div>
      <HomeNav />
      <Outlet />
    </div>
  );
}

export default HomeNavWrapper;
