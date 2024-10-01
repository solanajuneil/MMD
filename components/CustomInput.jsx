import { Input } from 'react-native-elements'

const CustomInput = ({...inputProps}) => {
  return (
      <Input
        inputStyle={{ color: "#3E5076" }}
        containerStyle={{marginBottom: 10}}
        leftIconContainerStyle={{ marginRight: 10 }}
        {...inputProps}
    />
  )
}

export default CustomInput