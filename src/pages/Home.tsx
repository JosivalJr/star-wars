import { Link } from "react-router-dom";
import Header from "../components/Header";
import NavigateBtn from "../components/NavigateBtn";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-death-star bg-cover">
      <Header title="" showSearchBar={false} onSearch={() => {}} />

      <main className="flex flex-col flex-grow justify-between mx-4 md:mx-32">
        <div className="flex flex-col flex-grow justify-center text-white font-kodemono">
          <h2 className="text-6xl md:text-5xl lg:text-6xl">
            Desperte o Jedi <br /> que há em Você
          </h2>
          <h3 className="text-lg md:text-xl lg:text-2xl pt-4 md:pt-8 ">
            Descubra o universo de Star Wars.
          </h3>
        </div>

        <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:flex lg:flex-wrap justify-center justify-items-center gap-6 p-4 md:p-16">
          <Link to="species">
            <NavigateBtn iconName="species" text="species" />
          </Link>
          <Link to="planets">
            <NavigateBtn iconName="planets" text="planets" />
          </Link>
          <Link to="movies">
            <NavigateBtn iconName="movies" text="movies" />
          </Link>
          <Link to="characters">
            <NavigateBtn iconName="characters" text="characters" />
          </Link>
          <Link to="vehicles">
            <NavigateBtn iconName="vehicles" text="vehicles" />
          </Link>
          <Link to="starships">
            <NavigateBtn iconName="starships" text="starships" />
          </Link>
        </div>
      </main>
    </div>
  );
}
