import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import SpecieCard from "../components/SpecieCard";
import { ISpecie } from "../types/swapi";
import { SpecieService } from "../services/api";

import { MdOutlineNavigateNext } from "react-icons/md";

export default function Specie() {
  const [species, setSpecies] = useState<ISpecie[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSpecie, setSelectedSpecie] = useState<ISpecie | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleModal = (specie?: ISpecie) => {
    setIsModalOpen((prev) => !prev);
    if (specie) setSelectedSpecie(specie);
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
    const listSpecies = async (page?: number) => {
      setLoading(true);
      setError(null);
      const result = await SpecieService.list(page);

      if (result instanceof Error) {
        setError(result);
      } else {
        setSpecies((prev) => [...prev, ...result.results]);
        if (result.next) {
          const nextPage = getNextPage(result.next);
          if (typeof nextPage === "number") {
            await listSpecies(nextPage);
          }
        }
      }
      setLoading(false);
    };

    listSpecies();
  }, []);

  const filteredSpecies = species.filter(
    (specie) =>
      specie.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      specie.name.toLowerCase() !== "unknown"
  );

  const paginatedSpecies = filteredSpecies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredSpecies.length) {
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
    <div className="flex flex-col min-h-screen bg-species bg-cover">
      <Header title="species" showSearchBar={true} onSearch={handleSearch} />

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
          paginatedSpecies.map((specie) => (
            <Card
              key={specie.name}
              cardTitle={specie.name}
              folder="species"
              toggleModal={() => toggleModal(specie)}
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
          disabled={currentPage * itemsPerPage >= filteredSpecies.length}
          className="px-4 py-2 m-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          <MdOutlineNavigateNext />
        </button>
      </main>

      {isModalOpen && selectedSpecie && (
        <SpecieCard
          cardInfos={selectedSpecie}
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
