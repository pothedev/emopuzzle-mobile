import { } from "native-base";
import { StyleSheet, View, Text, Image, TouchableOpacity  } from "react-native";
import { TouchEventType } from "react-native-gesture-handler/lib/typescript/TouchEventType";

const WellDone: React.FC<{navigation: any; route:any}> = ({navigation, route}) => {
  const {moduleIndex, moduleTitle} = route.params

  return (
    <View style={styles.wrapper}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <Image source={require('../assets/galya.png')} resizeMode='contain' style={{width: '50%'}} alt="galya"></Image>
        <Text style={styles.gj}>Great job! You did well with the task</Text>
        <Text style={styles.finished}>Module {moduleIndex.replace('module', '')} is finished </Text>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
        <TouchableOpacity onPress={() => {navigation.navigate('Module', {module: moduleIndex, title: moduleTitle})}}>
          <View style={styles.button}>
            <Text>Continue</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 60,
    height: '100%',
    backgroundColor: '#fff'
  },
  gj: {
    width: 250,
    fontWeight: 500,
    fontSize: 22,
    textAlign: 'center',
    marginTop: 5,
    marginBottom: 20
  },
  finished: {
    fontSize: 17,
    textAlign: 'center',
    color: '#454545'
  },
  button: {
    paddingVertical: 13,
    paddingHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCECFC',
    borderRadius: 16
  }
})

export default WellDone