import Svg, { Path } from 'react-native-svg';

const DeviceIcon = () => {
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={28}
      height={28}
      stroke="#3E5076"
      viewBox="0 0 24 24"
      fillRule="evenodd"
      clipRule="evenodd"
    >
      <Path d="M12 0c6.623 0 12 5.377 12 12s-5.377 12-12 12-12-5.377-12-12 5.377-12 12-12zm0 2c5.519 0 10 4.481 10 10s-4.481 10-10 10-10-4.481-10-10 4.481-10 10-10zm2 12v-3l5 4-5 4v-3h-9v-2h9zm-4-6v-3l-5 4 5 4v-3h9v-2h-9z" />
    </Svg>
  );
};

export default DeviceIcon;
