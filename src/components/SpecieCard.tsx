import { MdClose } from "react-icons/md";
import { ISpecie } from "../types/swapi";
import { useState } from "react";
import sanitizeImageName from "../utils/sanitizeName";

interface Props {
  cardInfos: ISpecie;
  toggleModal: () => void;
}

export default function SpecieCard({ cardInfos, toggleModal }: Props) {
  const backgroundFileName = sanitizeImageName(cardInfos.name);
  const initialBackgroundImage = `${
    import.meta.env.VITE_BASE_URL
  }assets/images/species/${backgroundFileName}.jpg`;
  const [backgroundImage, setBackgroundImage] = useState(
    initialBackgroundImage
  );

  const handleImageError = () => {
    setBackgroundImage(
      `${import.meta.env.VITE_BASE_URL}assets/images/species/default.png`
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
            <span className="text-blue-400">Classification: </span>
            {cardInfos.classification == "n/a" ||
            cardInfos.classification == "unknown"
              ? "Desconhecido"
              : cardInfos.classification}{" "}
            <br />
            <span className="text-blue-400">Designation: </span>
            {cardInfos.designation} <br />
            <span className="text-blue-400">Hair Colors: </span>
            {cardInfos.hair_colors == "n/a" ||
            cardInfos.hair_colors == "unknown"
              ? "Desconhecido"
              : cardInfos.hair_colors}
            <br />
            <span className="text-blue-400">Skin Colors: </span>
            {cardInfos.skin_colors == "n/a" ||
            cardInfos.skin_colors == "unknown"
              ? "Desconhecido"
              : cardInfos.skin_colors}
            <br />
            <span className="text-blue-400">Eyes Colors: </span>
            {cardInfos.eye_colors == "n/a" || cardInfos.eye_colors == "unknown"
              ? "Desconhecido"
              : cardInfos.eye_colors}
            <br />
            <span className="text-blue-400">Language: </span>
            {cardInfos.language} <br />
            <br />
          </p>
        </div>
      </div>
    </div>
  );
}
