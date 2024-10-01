import Svg, { Path } from "react-native-svg";

const ProfileIcon = () => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={35} height={35} viewBox="0 0 24 24">
      <Path
        d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z"
        fill="none"
        stroke="#3E5076"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ProfileIcon;
