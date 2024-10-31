import { MdClose } from "react-icons/md";
import { IMovie } from "../types/swapi";
import { useState } from "react";
import sanitizeImageName from "../utils/sanitizeName";

interface Props {
  cardInfos: IMovie;
  toggleModal: () => void;
}

export default function MovieCard({ cardInfos, toggleModal }: Props) {
  const backgroundFileName = sanitizeImageName(cardInfos.title);
  const initialBackgroundImage = `${
    import.meta.env.VITE_BASE_URL
  }assets/images/movies/${backgroundFileName}.jpg`;
  const [backgroundImage, setBackgroundImage] = useState(
    initialBackgroundImage
  );

  const handleImageError = () => {
    setBackgroundImage(
      `${import.meta.env.VITE_BASE_URL}assets/images/movies/default.png`
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div
        className="relative bg-cover bg-center py-6 px-8 rounded-xl shadow-lg w-4/5 h-3/5 max-w-5xl font-kodemono text-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <img
          src={backgroundImage}
          alt={cardInfos.title}
          className="hidden"
          onError={handleImageError}
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/100 via-30% to-transparent opacity-90 rounded-xl"></div>

        <div className="relative z-10">
          <div className="w-full flex justify-between">
            <h3 className="text-5xl">{cardInfos.title}</h3>
            <button onClick={toggleModal}>
              <MdClose size={48} color="white" />
            </button>
          </div>

          <p className="pt-10 text-2xl capitalize leading-10">
            <span className="text-blue-400">Episode: </span>
            {cardInfos.episode_id} <br />
            <span className="text-blue-400">Director: </span>
            {cardInfos.director} <br />
            <span className="text-blue-400">Description: </span>
            {cardInfos.producer} <br />
            <span className="text-blue-400">Release Date: </span>
            {cardInfos.release_date} <br />
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}
