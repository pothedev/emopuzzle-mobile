import { background } from 'native-base/lib/typescript/theme/styled-system';
import React, { useState, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, Animated, Easing } from 'react-native';

const modules = [
  {
    id: 1,
    title: 'Reading with visualisation',
    image: require('../assets/module1.png'),
    description: 'The child reads the text in paragraphs, and the system generates images for each fragment. After reading, they take a test to identify the emotions presented in the text.',
  },
  {
    id: 2,
    title: 'Expression of emotions',
    image: require('../assets/module2.png'),
    description: 'The child is given a situation to analyze and must depict the appropriate emotion using the camera (for example, smile, express surprise, or sadness).',
  },
  // {
  //   id: 3,
  //   title: 'Decision-making', 
  //   image: require('../assets/module3.png'),
  //   description: 'After reading the story, the child chooses how they would act in this situation. This helps them understand how to react correctly in everyday life.',
  // },
];

const handleModulePress = (moduleId: number, navigation: any) => {
  if (moduleId === 1){
    navigation.navigate("Module1Tale", {storyIndex: 1, storyTitle: "Reading with visualisation", moduleIndex: 1, moduleTitle: "Reading with visualisation"})
  }
  if (moduleId === 2){
    navigation.navigate("Module2Camera", {storyIndex: 1, storyTitle: "Expression of emotions", moduleIndex: 2, moduleTitle: "Expression of emotions"})
  }
}


const Home: React.FC<{navigation: any}> = ({navigation}) => {
  const [activeId, setActiveId] = useState<number | null>(null);
  const animationValues = useRef(modules.map(() => new Animated.Value(0))).current;

  const toggleCard = (id: number) => {
    const isActive = id === activeId;
    const index = modules.findIndex(module => module.id === id);
    
    if (isActive) {
      // Immediately update the state
      setActiveId(null);
      // Then run the collapse animation
      Animated.timing(animationValues[index], {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    } else {
      // If there's an active card, close it first
      if (activeId !== null) {
        const previousActiveIndex = modules.findIndex(module => module.id === activeId);
        
        // Immediately update the state
        setActiveId(id);
        // Run animations
        Animated.parallel([
          Animated.timing(animationValues[previousActiveIndex], {
            toValue: 0,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(animationValues[index], {
            toValue: 1,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
          })
        ]).start();
      } else {
        // Immediately update the state
        setActiveId(id);
        // Then run the expand animation
        Animated.timing(animationValues[index], {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      }
    }
  };

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={styles.scrollContent}>
      <View style={styles.headerRow}>
        <Text style={styles.greeting}>Good morning!</Text>
        <Image source={require('../assets/account.png')} resizeMode="contain" style={styles.accountImage} />
      </View>

      <Text style={styles.sectionTitle}>Learning modules</Text>

      {modules.map((module, index) => {
        const isActive = module.id === activeId;
        
        // Interpolate height for smooth expansion
        const cardHeight = animationValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: [230, 320],
        });

        // Rotate arrow based on active state
        const rotateArrow = animationValues[index].interpolate({
          inputRange: [0, 1],
          outputRange: ['0deg', '180deg'],
        });

        return (
          <TouchableOpacity 
            key={module.id} 
            //onPress={() => {module.id === 1 && !isActive ? navigation.navigate("Module1Tale", {storyIndex: 1, storyTitle: "test", moduleIndex: 1, moduleTitle: "Reading with visualisation"}) : navigation.navigate}}
            onPress={() => !isActive ? toggleCard(module.id) : handleModulePress(module.id, navigation)}
            activeOpacity={0.9}
          >
            <Animated.View style={[
              styles.card, 
              isActive && styles.activeCard,
              { height: cardHeight }
            ]}>
              <View style={styles.cardHeader}>
                <View style={isActive ? styles.activeRow : styles.row}>
                  <View style={isActive ? styles.activeNumberContainer : styles.numberContainer}>
                    <Text style={styles.numberText}>{module.id}</Text>
                  </View>
                  <Text style={styles.cardTitle}>{module.title}</Text>
                </View>
                <TouchableOpacity onPress={() => { toggleCard(module.id)}}>
                  <Animated.Image 
                    source={require('../assets/arrow-up.png')} 
                    resizeMode='contain' 
                    style={[
                      styles.arrowImage,
                      { transform: [{ rotate: rotateArrow }] }
                    ]}
                  />
                </TouchableOpacity>          
              </View>
              <Image source={module.image} style={styles.cardImage} resizeMode="contain" />
              <Animated.View
                style={{
                  opacity: animationValues[index],
                  height: animationValues[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 80],
                  }),
                }}
              >
                <Text style={styles.description}>{module.description}</Text>
              </Animated.View>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  scrollContent: {
    paddingBottom: 60,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 25,
  },
  accountImage: {
    width: 35,
    height: 35,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#DCECFC',
    borderRadius: 20,
    padding: 10,
    marginBottom: 20,
  },
  activeCard: {
    backgroundColor: '#BEDBF9',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    paddingRight: 7
  },
  numberContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    width: 40,
    height: 40,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeNumberContainer: {
    backgroundColor: '#E0E0E0',
    borderRadius: 12,
    width: 40,
    height: 40,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  numberText: {
    fontWeight: '600',
    fontSize: 17,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  cardImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
    paddingHorizontal: 5
  },
  arrowImage: {
    width: 17,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    flex: 1,
    marginRight: 15
  },
  activeRow: {
    backgroundColor: "#fff",
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 10,
    flex: 1,
    marginRight: 10
  }
});

export default Home;