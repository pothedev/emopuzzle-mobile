import React from 'react';
import { ScrollView, StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { Text } from 'native-base';
import { useRoute } from '@react-navigation/native';

const modules = {
  module1: [
    { id: 1, name: 'The lost Hat' },
    { id: 2, name: 'Bella is Coming for Help' },
    { id: 3, name: 'The Ruined Picnic' },
    { id: 4, name: 'The Shiny Stones Mystery' },
    { id: 5, name: 'A Glow in the Night Sky' },
  ],
  module2: [
    { id: 1, name: 'A Sweet Surprise' },
    { id: 2, name: 'The Lost Toy' },
    { id: 3, name: 'An Unexpected Sound' },
    { id: 4, name: 'The Ruined Book' },
    { id: 5, name: 'An Unexpected Gift of Time' },
  ],
  module3: [
    { id: 1, name: 'Shopping' },
  ],
};


const pages = {
  'module1': 'Module1Tale',
  'module2': 'Module2Camera',
  'module3': 'Module3Novel'
}

const Module: React.FC<{navigation: any; route: any}> = ({navigation, route}) => {
  const { module, title } = route.params as { module: keyof typeof modules; title: string };

  const lessons = modules[module];

  return (
    <ScrollView style={styles.wrapper} contentContainerStyle={{ paddingBottom: 40, paddingTop: 30}}>
      <View style={{flexDirection: 'row', marginBottom: 5, gap: 13}}>
        <TouchableOpacity onPress={() => {navigation.navigate('Home')}}>
          <Image source={require('../assets/arrow-left.png')} resizeMode='contain' style={{height: 18, width: 16}}></Image>
        </TouchableOpacity>
        <View>
          <Text style={styles.moduleTitle}>Module {module.replace('module', '')}</Text>
          <Text style={styles.subtitle}>{title}</Text>
        </View>
      </View>
      

      <View style={styles.progressHeader}>
        <Text style={styles.progressLabel}>Progression</Text>
        <Text style={styles.progressDate}>March 2025</Text>
      </View>

      <View style={{ width: '100%', aspectRatio: 2.532, marginBottom: 20 }}>
        <Image
          source={require('../assets/progress.png')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover" // or 'stretch'
        />
      </View>

      {lessons.map((lesson) => (
        <TouchableOpacity key={lesson.id} style={styles.lessonRow} onPress={() => {navigation.navigate(pages[module], {storyIndex: lesson.id, storyTitle: lesson.name, moduleIndex: module, moduleTitle: title})}}>
          <View style={styles.lessonNumber}>
            <Text style={styles.lessonNumberText}>{lesson.id}</Text>
          </View>
          <Text style={styles.lessonText}>{lesson.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
    paddingTop: 20,
    backgroundColor: '#fff',
  },
  moduleTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 25,
    color: '#555',
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  progressDate: {
    fontSize: 16,
    fontWeight: '500',
  },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  lessonNumber: {
    backgroundColor: '#DCEEFF',
    borderRadius: 10,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  lessonNumberText: {
    fontWeight: '400',
    fontSize: 16,
  },
  lessonText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#222',
  },
});

export default Module