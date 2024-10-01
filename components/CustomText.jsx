import { Text } from 'react-native';

const CustomText = ({ children, ...textProps }) => {
    return (
        <Text style={{ color: "#3E5076", fontFamily: 'bold', fontSize: 20}} {...textProps}>
            {children}
        </Text>
    )
}

export default CustomText;
