import { MdClose } from "react-icons/md";
import { ICharacter } from "../types/swapi";
import { useState } from "react";
import sanitizeImageName from "../utils/sanitizeName";
import formatDate from "../utils/formatDate";

interface Props {
  cardInfos: ICharacter;
  toggleModal: () => void;
}

export default function CharacterCard({ cardInfos, toggleModal }: Props) {
  const backgroundFileName = sanitizeImageName(cardInfos.name);
  const initialBackgroundImage = `${
    import.meta.env.VITE_BASE_URL
  }assets/images/characters/${backgroundFileName}.jpg`;
  const [backgroundImage, setBackgroundImage] = useState(
    initialBackgroundImage
  );

  const handleImageError = () => {
    setBackgroundImage(
      `${import.meta.env.VITE_BASE_URL}assets/images/characters/default.png`
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div
        className="relative bg-cover bg-center py-6 px-8 rounded-xl shadow-lg w-4/5 md:min-h-[60%] max-w-5xl font-kodemono text-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <img
          src={backgroundImage}
          alt={cardInfos.name}
          className="hidden"
          onError={handleImageError}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/100 via-30% to-transparent opacity-90 rounded-xl"></div>

        <div className="relative z-10">
          <div className="w-full flex justify-between">
            <h3 className="text-5xl">{cardInfos.name}</h3>
            <button onClick={toggleModal}>
              <MdClose size={48} color="white" />
            </button>
          </div>

          <p className="pt-10 text-2xl capitalize leading-10">
            <span className="text-blue-400">Gender: </span> {cardInfos.gender}
            <br />
            <span className="text-blue-400">Birth year: </span>
            {cardInfos.birth_year} <br />
            <span className="text-blue-400">Planet: </span>{" "}
            {cardInfos.homeworld}
            <br />
            <span className="text-blue-400">Color Eyes: </span>
            {cardInfos.eye_color} <br />
            <span className="text-blue-400">Movies: </span>
            <span className="text-lg">
              {cardInfos.movies.length > 0 &&
                cardInfos.movies.map((movie) => (
                  <span className="block" key={movie.title}>
                    <span className="text-blue-200">{movie.title}</span>
                    <span>{` (${formatDate(movie.release_date)})`} </span>
                  </span>
                ))}
            </span>
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}
