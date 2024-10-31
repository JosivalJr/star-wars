type Props = {
  iconName: string;
  text: string;
};

export default function NavigateBtn({ iconName, text }: Props) {
  return (
    <button className="w-32 h-32 rounded-2xl border border-solid border-gray-100 bg-gray-default flex flex-col justify-center items-center transition-transform transform hover:scale-110 hover:bg-gray-500">
      <img
        className="p-4"
        src={`${
          import.meta.env.VITE_BASE_URL
        }assets/images/icons/${iconName}.png`}
        alt=""
      />
      <p className="font-kodemono text-base font-bold text-white uppercase">
        {text}
      </p>
    </button>
  );
}
