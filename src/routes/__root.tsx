import * as React from "react";
import { Outlet, createRootRoute } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <React.Fragment>
      {/* Aqui você pode colocar Navbar, Footer, Layout, etc */}
      <Outlet />
    </React.Fragment>
  );
}
