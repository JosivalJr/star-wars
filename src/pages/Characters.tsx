import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import CharacterCard from "../components/CharacterCard";
import { ICharacter, IMovie, IPlanet } from "../types/swapi";
import { CharacterService, MovieService, PlanetService } from "../services/api";
import { MdOutlineNavigateNext } from "react-icons/md";

export default function Characters() {
  const [characters, setCharacters] = useState<ICharacter[]>([]);
  const [movies, setMovies] = useState<IMovie[]>([]);
  const [planets, setPlanets] = useState<IPlanet[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [moviesLoaded, setMoviesLoaded] = useState(false);
  const [planetsLoaded, setPlanetsLoaded] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(6);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState<ICharacter | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const toggleModal = (character?: ICharacter) => {
    setIsModalOpen((prev) => !prev);
    if (character) setSelectedCharacter(character);
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
        } else {
          setMoviesLoaded(true);
        }
      }
    };

    const listPlanets = async (page?: number) => {
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
        } else {
          setPlanetsLoaded(true);
        }
      }
    };

    listPlanets();
    listMovies();
  }, []);

  useEffect(() => {
    if (!moviesLoaded || !planetsLoaded) return;

    const listCharacters = async (page?: number) => {
      setLoading(true);
      setError(null);
      const result = await CharacterService.list(page);

      if (result instanceof Error) {
        setError(result);
      } else {
        result.results.map((char) => {
          char.movies = [];
          char.films.forEach((url) => {
            const movie = movies.find((movie) => movie.url === url);
            if (movie) char.movies.push(movie);
          });
          const homeworld = planets.find(
            (planet) => planet.url === char.homeworld
          );
          char.homeworld = homeworld ? homeworld.name : "Desconhecido";
        });
        setCharacters((prev) => [...prev, ...result.results]);
        if (result.next) {
          const nextPage = getNextPage(result.next);
          if (typeof nextPage === "number") {
            await listCharacters(nextPage);
          }
        }
      }
      setLoading(false);
    };

    listCharacters();
  }, [moviesLoaded, planetsLoaded, planets, movies]);

  const filteredCharacters = characters.filter(
    (char) =>
      char.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      char.name.toLowerCase() !== "unknown"
  );

  const paginatedCharacters = filteredCharacters.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    if (currentPage * itemsPerPage < filteredCharacters.length) {
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
    <div className="flex flex-col min-h-screen bg-character bg-cover">
      <Header title="characters" showSearchBar={true} onSearch={handleSearch} />

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
          paginatedCharacters.map((char) => (
            <Card
              key={char.name}
              cardTitle={char.name}
              folder="characters"
              toggleModal={() => toggleModal(char)}
            />
          ))}
      </div>

      <main className="flex justify-center items-center mb-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1 || loading === true}
          className="px-4 py-2 m-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          <MdOutlineNavigateNext className="rotate-180" />
        </button>
        <button
          onClick={handleNextPage}
          disabled={
            currentPage * itemsPerPage >= filteredCharacters.length ||
            loading === true
          }
          className="px-4 py-2 m-2 bg-gray-700 text-white rounded-lg disabled:opacity-50"
        >
          <MdOutlineNavigateNext />
        </button>
      </main>

      {isModalOpen && selectedCharacter && (
        <CharacterCard
          cardInfos={selectedCharacter}
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
