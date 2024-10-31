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
    <div className="flex flex-col md:flex-row items-center justify-between p-4 h-auto md:mx-32 md:h-36">
      <div className="flex items-center justify-start w-1/3">
        <Link to={"/"}>
          <p className="font-starjedi text-2xl md:text-logo text-center text-white transition-transform transform hover:scale-105">
            Star <br className="hidden md:block" /> Wars
          </p>
        </Link>
      </div>

      <div className="flex items-center justify-center w-1/3">
        <h2 className="font-kodemono text-3xl md:text-5xl text-white uppercase text-center">
          {title}
        </h2>
      </div>

      <div className="flex items-center justify-end w-1/3">
        {showSearchBar && (
          <input
            type="text"
            onChange={handleSearchChange}
            className="h-8 bg-[#141414] rounded-3xl p-4 text-white font-kodemono uppercase"
            placeholder="Search..."
          />
        )}
      </div>
    </div>
  );
}
