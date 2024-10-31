import { useState } from "react";
import { AiFillInfoCircle } from "react-icons/ai";
import sanitizeImageName from "../utils/sanitizeName";

interface Props {
  cardTitle: string;
  folder: string;
  toggleModal: () => void;
}

export default function Card({ cardTitle, folder, toggleModal }: Props) {
  const backgroundFileName = sanitizeImageName(cardTitle);
  const initialBackgroundImage = `${
    import.meta.env.VITE_BASE_URL
  }assets/images/${folder}/${backgroundFileName}.jpg`;
  const [backgroundImage, setBackgroundImage] = useState(
    initialBackgroundImage
  );

  const handleImageError = () => {
    setBackgroundImage(`/assets/images/${folder}/default.png`);
  };

  return (
    <div
      className="relative bg-cover bg-center mx-6 shadow-lg flex flex-col justify-between w-64 h-80 rounded-2xl backdrop-blur-sm transition-transform transform hover:scale-105"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <img
        src={backgroundImage}
        alt={cardTitle}
        className="hidden"
        onError={handleImageError}
      />

      <h6 className="font-kodemono text-white text-center p-3 uppercase text-shadow">
        {cardTitle}
      </h6>

      <div className="h-6 m-3 flex justify-end cursor-pointer">
        <AiFillInfoCircle
          color="white"
          size={24}
          onClick={() => toggleModal()}
        />
      </div>
    </div>
  );
}
