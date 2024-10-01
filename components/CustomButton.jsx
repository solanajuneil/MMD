import { TouchableOpacity } from 'react-native'
import { Button } from 'react-native-elements'

const CustomButton = ({ ...buttonProps}) => {

    return (
        <Button
            TouchableComponent={TouchableOpacity}
            containerStyle={{width:"100%"}}
            buttonStyle={{backgroundColor: "#BCEBFE", paddingVertical:12}}
            titleStyle={{ color: "#3E5076", fontFamily:"bold"}}
            {...buttonProps}
        />
  )
}

export default CustomButton