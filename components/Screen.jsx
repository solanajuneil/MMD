import React from 'react'
import { Platform } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'


const Screen = ({children}) => {
    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: "#EFFAFF",
            paddingHorizontal: 20
        }}>
            <KeyboardAwareScrollView
                showsHorizontalScrollIndicator={Platform.OS === 'android' ? true : false}
                bounces={false}
                contentContainerStyle={{alignItems: "center", flex: 1, width: "100%"}}
                extraHeight={160}
            >
                {children}
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )

}

export default Screen