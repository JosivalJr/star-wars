import {
  Home,
  Characters,
  Movies,
  Species,
  Starships,
  Vehicles,
  Planets,
} from "../pages";

const Routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "species",
    element: <Species />,
  },
  {
    path: "planets",
    element: <Planets />,
  },
  {
    path: "movies",
    element: <Movies />,
  },
  {
    path: "characters",
    element: <Characters />,
  },
  {
    path: "vehicles",
    element: <Vehicles />,
  },
  {
    path: "starships",
    element: <Starships />,
  },
];

export default Routes;
