import Svg, { Path } from "react-native-svg";

const LogoutIcon = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24">
      <Path
        d="M10 9V5a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-6a1 1 0 0 1-1-1v-4"
        fill="none"
        stroke="#3E5076"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M17 12H3m3-3l-3 3 3 3"
        fill="none"
        stroke="#3E5076"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default LogoutIcon;
