import { BrowserRouter, Routes, Route } from "react-router";
import { AppRoutes } from "./utils/routes";
import AppProviders from "./provider/AppProviders";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {AppRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <AppProviders showSidebar={Boolean(route.showSidebar)}>
                {<route.element />}
              </AppProviders>
            }
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
