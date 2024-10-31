import { Link } from "react-router-dom";
type Props = {
  title: string;
  showSearchBar: boolean;
  onSearch: (searchTerm: string) => void;
};

export default function Header({ title, showSearchBar, onSearch }: Props) {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-between p-4 h-auto md:mx-32 md:h-36 space-y-4 md:space-y-0">
      <div className="flex items-center justify-center md:justify-start w-full md:w-1/3">
        <Link to={"/"}>
          <p className="font-starjedi text-2xl md:text-logo text-center text-white transition-transform transform hover:scale-105">
            Star <br className="hidden md:block" /> Wars
          </p>
        </Link>
      </div>

      <div className="flex items-center justify-center w-full md:w-1/3">
        <h2 className="font-kodemono text-2xl sm:text-3xl md:text-5xl text-white uppercase text-center">
          {title}
        </h2>
      </div>

      <div className="flex items-center justify-center md:justify-end w-full md:w-1/3">
        {showSearchBar && (
          <input
            type="text"
            onChange={handleSearchChange}
            className="w-full md:w-auto h-8 bg-[#141414] rounded-3xl p-2 md:p-4 text-white font-kodemono uppercase"
            placeholder="Search..."
          />
        )}
      </div>
    </div>
  );
}
