import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import StarshipCard from "../components/StarshipCard";
import { IStarship } from "../types/swapi";
import { StarshipService } from "../services/api";

import { MdOutlineNavigateNext } from "react-icons/md";

export default function Starship() {
  const [starships, setStarships] = useState<IStarship[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStarship, setSelectedStarship] = useState<IStarship | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleModal = (starship?: IStarship) => {
    setIsModalOpen((prev) => !prev);
    if (starship) setSelectedStarship(starship);
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
    const listStarships = async (page?: number) => {
      setLoading(true);
      setError(null);
      const result = await StarshipService.list(page);

      if (result instanceof Error) {
        setError(result);
      } else {
        setStarships((prev) => [...prev, ...result.results]);
        if (result.next) {
          const nextPage = getNextPage(result.next);
          if (typeof nextPage === "number") {
            await listStarships(nextPage);
          }
        }
      }
      setLoading(false);
    };

    listStarships();
  }, []);

  const filteredStarships = starships.filter(
    (starship) =>
      starship.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      starship.name.toLowerCase() !== "unknown"
  );

  const paginatedStarships = filteredStarships.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredStarships.length) {
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
    <div className="flex flex-col min-h-screen bg-starship bg-cover">
      <Header title="starships" showSearchBar={true} onSearch={handleSearch} />

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
          paginatedStarships.map((starship) => (
            <Card
              key={starship.name}
              cardTitle={starship.name}
              folder="starships"
              toggleModal={() => toggleModal(starship)}
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
          disabled={currentPage * itemsPerPage >= filteredStarships.length}
          className="px-4 py-2 m-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          <MdOutlineNavigateNext />
        </button>
      </main>

      {isModalOpen && selectedStarship && (
        <StarshipCard
          cardInfos={selectedStarship}
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
