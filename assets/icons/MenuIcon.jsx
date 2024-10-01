import Svg, { Path } from "react-native-svg";

const MenuIcon = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24">
      <Path
        d="M3 6h18M3 12h18M3 18h18"
        fill="none"
        stroke="#3E5076"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default MenuIcon;
