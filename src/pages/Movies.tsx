import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import MovieCard from "../components/MovieCard";
import { IMovie } from "../types/swapi";
import { MovieService } from "../services/api";

import { MdOutlineNavigateNext } from "react-icons/md";

export default function Movies() {
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<IMovie | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleModal = (movie?: IMovie) => {
    setIsModalOpen((prev) => !prev);
    if (movie) setSelectedMovie(movie);
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
    const listMovies = async (page?: number) => {
      setLoading(true);
      setError(null);
      const result = await MovieService.list(page);

      if (result instanceof Error) {
        setError(result);
      } else {
        setMovies((prev) => [...prev, ...result.results]);
        if (result.next) {
          const nextPage = getNextPage(result.next);
          if (typeof nextPage === "number") {
            await listMovies(nextPage);
          }
        }
      }
      setLoading(false);
    };

    listMovies();
  }, []);

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
      movie.title.toLowerCase() !== "unknown"
  );

  const paginatedMovies = filteredMovies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredMovies.length) {
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
    <div className="flex flex-col min-h-screen bg-movie bg-cover">
      <Header title="movies" showSearchBar={true} onSearch={handleSearch} />

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
          paginatedMovies.map((movie) => (
            <Card
              key={movie.title}
              cardTitle={movie.title}
              folder="movies"
              toggleModal={() => toggleModal(movie)}
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
          disabled={currentPage * itemsPerPage >= filteredMovies.length}
          className="px-4 py-2 m-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          <MdOutlineNavigateNext />
        </button>
      </main>

      {isModalOpen && selectedMovie && (
        <MovieCard
          cardInfos={selectedMovie}
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
