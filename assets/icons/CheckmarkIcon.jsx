import Svg, { Ellipse, G, Path } from "react-native-svg";

const CheckmarkIcon = ({ ...propsCheck }) => {
  return (
    <Svg xmlns="http://www.w3.org/2000/svg" width={30.184} height={30.164} viewBox="0 0 30.184 30.164" {...propsCheck}>
      <G transform="translate(0 -.168)">
        <Ellipse data-name="Ellipse 12" cx={15.092} cy={15.082} rx={15.092} ry={15.082} transform="translate(0 .168)" fill={"#19EDBE"} />
        <Path data-name="Pfad 1" d="M13.882 23.272l-7.136-5.559 2.029-2.6 4.382 3.414 7.232-10.436 2.714 1.88z" fill={"#EFFAFF"} />
      </G>
    </Svg>
  );
}

export default CheckmarkIcon