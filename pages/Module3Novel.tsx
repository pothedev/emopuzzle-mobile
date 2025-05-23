import {View, Text, ScrollView, Image, StyleSheet} from 'react-native'

const Module3Novel: React.FC<{navigation:any, route:any}> = ({navigation, route}) => {
  const {storyIndex, storyTitle, moduleIndex, moduleTitle} = route.params
  return (
    <View style={styles.wrapper}>
      <Text>{storyIndex}</Text>
      <Text>{storyTitle}</Text>
    </View>
  )
}


const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20
  }
})


export default Module3Novel