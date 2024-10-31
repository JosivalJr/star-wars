import { MdClose } from "react-icons/md";
import { IPlanet } from "../types/swapi";
import { useState } from "react";
import sanitizeImageName from "../utils/sanitizeName";
import numberDotMask from "../utils/numberDotMask";

interface Props {
  cardInfos: IPlanet;
  toggleModal: () => void;
}

export default function PlanetCard({ cardInfos, toggleModal }: Props) {
  const backgroundFileName = sanitizeImageName(cardInfos.name);
  const initialBackgroundImage = `${
    import.meta.env.VITE_BASE_URL
  }assets/images/planets/${backgroundFileName}.jpg`;
  const [backgroundImage, setBackgroundImage] = useState(
    initialBackgroundImage
  );

  const handleImageError = () => {
    setBackgroundImage(
      `${import.meta.env.VITE_BASE_URL}assets/images/planets/default.png`
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
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

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 via-30% to-transparent opacity-80 rounded-xl"></div>

        <div className="relative z-10">
          <div className="w-full flex justify-between">
            <h3 className="text-5xl">{cardInfos.name}</h3>
            <button onClick={toggleModal}>
              <MdClose size={48} color="white" />
            </button>
          </div>

          <p className="pt-10 text-2xl capitalize leading-10">
            <span className="text-blue-400">Population: </span>
            {cardInfos.population == "n/a" || cardInfos.population == "unknown"
              ? "Desconhecido"
              : numberDotMask(Number(cardInfos.population))}
            <br />
            <span className="text-blue-400">Terrain: </span> {cardInfos.terrain}
            <br />
            <span className="text-blue-400">Climate: </span> {cardInfos.climate}
            <br />
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}
