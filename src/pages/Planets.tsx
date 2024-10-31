import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import PlanetCard from "../components/PlanetCard";
import { IPlanet } from "../types/swapi";
import { PlanetService } from "../services/api";

import { MdOutlineNavigateNext } from "react-icons/md";

export default function Planets() {
  const [planets, setPlanets] = useState<IPlanet[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<IPlanet | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleModal = (planet?: IPlanet) => {
    setIsModalOpen((prev) => !prev);
    if (planet) setSelectedPlanet(planet);
  };

  const mainRef = useRef<HTMLElement | null>(null);

  const updateItemsPerPage = () => {
    const width = window.innerWidth;
    const mainElement = mainRef.current;
    const gap = mainElement
      ? parseInt(getComputedStyle(mainElement).gap) || 0
      : 0;

    const itemsPerColumn = Math.floor((width * 0.8 - gap) / 270);
    setItemsPerPage(itemsPerColumn * 2);
  };

  useEffect(() => {
    updateItemsPerPage();
    window.addEventListener("resize", updateItemsPerPage);
    return () => window.removeEventListener("resize", updateItemsPerPage);
  }, []);

  useEffect(() => {
    const listPlanets = async (page?: number) => {
      setLoading(true);
      setError(null);
      const result = await PlanetService.list(page);

      if (result instanceof Error) {
        setError(result);
      } else {
        setPlanets((prev) => [...prev, ...result.results]);
        if (result.next) {
          const nextPage = getNextPage(result.next);
          if (typeof nextPage === "number") {
            await listPlanets(nextPage);
          }
        }
      }
      setLoading(false);
    };

    listPlanets();
  }, []);

  const filteredPlanets = planets.filter(
    (planet) =>
      planet.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      planet.name.toLowerCase() !== "unknown"
  );

  const paginatedPlanets = filteredPlanets.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredPlanets.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleSearch = (searchTerm: string) => {
    setSearchTerm(searchTerm);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-planets bg-cover">
      <Header title="planets" showSearchBar={true} onSearch={handleSearch} />

      {loading && (
        <div className="flex justify-center items-center mb-4 grow">
          <div className="spinner"></div>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-center">
          An unexpected error occurred, contact support: {error.message}
        </p>
      )}

      <div className="grid grid-cols-[repeat(auto-fit,270px)] justify-center gap-4 mx-32 mb-6">
        {!loading &&
          !error &&
          paginatedPlanets.map((planet) => (
            <Card
              key={planet.name}
              cardTitle={planet.name}
              folder="planets"
              toggleModal={() => toggleModal(planet)}
            />
          ))}
      </div>

      <main className="flex justify-center items-center mb-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 m-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          <MdOutlineNavigateNext className="rotate-180" />
        </button>
        <button
          onClick={handleNextPage}
          disabled={currentPage * itemsPerPage >= filteredPlanets.length}
          className="px-4 py-2 m-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          <MdOutlineNavigateNext />
        </button>
      </main>

      {isModalOpen && selectedPlanet && (
        <PlanetCard
          cardInfos={selectedPlanet}
          toggleModal={() => toggleModal()}
        />
      )}
    </div>
  );
}

const getNextPage = (url: string): number | null => {
  const parsedUrl = new URL(url);
  const params = new URLSearchParams(parsedUrl.search);
  if (params.has("page")) return Number(params.get("page"));
  return null;
};
