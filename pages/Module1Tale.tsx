import React, { useEffect, useState, useRef} from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

const { width: screenWidth } = Dimensions.get('window');

const dummyOptions = [
  { label: 'Worry', isCorrect: false },
  { label: 'Anger', isCorrect: false },
  { label: 'Sadness', isCorrect: true },
  { label: 'Confusion', isCorrect: false },
];

 

const dummyQuestion = 'Що відчував Міло, коли не знайшов свою червону шапочку?'

const dummyText =
  "Milo, the little fox cub, woke up to a cool breeze drifting through his burrow. He yawned, stretched, and reached for his favorite red cap—but it wasn’t on the shelf. Milo blinked and looked again. Still nothing. He sniffed the corners of the burrow, peeked under his leaf bed, and even checked his toy chest. Empty. He walked outside, dragging his paws on the ground, and sat by a big rock. His ears drooped, and his tail curled around him. Milo stared silently at the grass.";

const mistakeDummy = 'Milo felt happy because he finally found his favorite red cap after looking for it everywhere! Bella helped him search all over the forest, and just when they were about to give up, she spotted it high up in a tree. When Milo saw it, his eyes got big with excitement, and he jumped for joy as he pulled it down. This shows he was really happy and full of excitement. When we find something we love and thought was gone, it can make us feel super happy—just like Milo!'

const dummyImage = '../assets/dummyIllustration.png'


const MistakePanel: React.FC<{mistakeText: string; setShowMistakePanel: any}> = ({mistakeText, setShowMistakePanel}) => {
  return (
    <View style={styles.mistakePanel}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', position: 'relative', marginBottom: 30 }}>
        <Text style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', fontSize: 18, fontWeight: 'bold' }}>
          Why should this be the{'\n'}answer?
        </Text>
        <TouchableOpacity onPress={() => {setShowMistakePanel(false)}}>
          <Image
            source={require('../assets/cross.png')}
            style={{ width: 16, height: 16 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.mistakeText}>{mistakeText}</Text>
    </View>
  )
}


const Module1Tale: React.FC<{ navigation: any; route: any }> = ({
  navigation,
  route,
}) => {
  const { storyIndex, storyTitle, moduleIndex, moduleTitle } = route.params;

  const [storyText, setStoryText] = useState<string>(dummyText);
  const [imageUri, setImageUri] = useState<string>(dummyImage);
  const [questionText, setQuestionText] = useState<string>(dummyQuestion);
  const [mistakeText, setMistakeText] = useState<string>(dummyQuestion)
  const [options, setOptions] = useState<Object[]>(dummyOptions)
  
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [paragraphIndex, setParagraphIndex] = useState<number>(1)

  const [loaded, setLoaded] = useState<boolean>(false)

  const [selected, setSelected] = useState<string | null>(null);
  const [choseWrong, setChoseWrong] = useState<boolean>(false)
  const [choseRight, setChoseRight] = useState<boolean>(false)

  const [showMistakePanel, setShowMistakePanel] = useState<boolean>(false)

  const [imageSource, setImageSource] = useState<any>(require('../assets/dummyIllustration.png'));


  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {

    const fetchText = async () => {
      try {
      //   const response = await fetch(`https://back-end-hazel-six.vercel.app/novel/create_novel`);
      //   const data = await response.json();
      //   const text = data.text
      //   console.log('data', data)
      //   console.log('text', text)
      //   const image = data.image
      //   const question = data.question
      //   const answers = data.answers
      //   const explanation = data.explanation

      //   const options = [
      //     {
      //       label: answers[0],
      //       isCorrect: true
      //     },
      //     {
      //       label: answers[1],
      //       isCorrect: false
      //     },
      //     {
      //       label: answers[2],
      //       isCorrect: false
      //     },
      //     {
      //       label: answers[3],
      //       isCorrect: false
      //     },
      //   ]
      //  const shuffled = [...options].sort(() => Math.random() - 0.5);


      //   setStoryText(text)
      //   setImageUri(image)
      //   setImageSource({ uri: image });
      //   setQuestionText(question)
      //   setMistakeText(explanation)
      //   setOptions(shuffled)
        
        setStoryText(dummyText);
        setMistakeText(mistakeDummy)
        setOptions(dummyOptions)
        setQuestionText(dummyQuestion)
        setImageUri(dummyImage)
        
        setLoaded(true);
      } catch (error) {
        console.error('Error fetching story text:', error);
      }
    };
    fetchText();
  }, [storyIndex, paragraphIndex]);


  function handleNextParagraph(){
    setLoaded(false)
    setChoseRight(false)
    setChoseWrong(false)
    setSelected(null)
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setParagraphIndex(paragraphIndex+1)
  }

   function handleLastParagraph(){
    navigation.navigate('WellDone', {moduleIndex: moduleIndex, moduleTitle: moduleTitle})
  }


  if (!loaded){
    return (
      <View style={styles.loadingContainer}>
        <FastImage
          source={require('../assets/beeAnim.gif')}
          style={styles.gif}
          resizeMode={FastImage.resizeMode.contain}
        />
        <Text>Loading...</Text>
      </View>
    )
  }
  else {
    return (
      <View>
        <ScrollView 
          style={styles.wrapper}
          contentContainerStyle={{ paddingBottom: 40, paddingTop: 40 }}
          ref={scrollRef}
        >
          <View
            style={{
              flexDirection: 'row',
              marginBottom: 20,
              gap: 13,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image
                source={require('../assets/arrow-left.png')}
                resizeMode="contain"
                style={{ height: 18, width: 16 }}
              />
            </TouchableOpacity>
            <Text style={styles.moduleTitle}>{storyTitle}</Text>
            <Text style={styles.pageIndicator}>{paragraphIndex}/5</Text>
          </View>

          <View style={styles.storyBubble}>
            <Text style={styles.storyText}>{storyText}</Text>
          </View>

          {imageUri && (
            <View style={{width: '100%'}}>
              <Image
                source={imageSource}
                style={{
                  width: '100%',
                  aspectRatio: 1,
                  borderBottomLeftRadius: 12,
                  borderBottomRightRadius: 12,
                  marginBottom: 40,
                }}
                resizeMode="cover"
              />

            </View>
          )}



          <Text style={styles.question}>
            {questionText}
          </Text>

          <View style={styles.optionsContainer}>
            {options.map((option) => {
              const isPressed = choseWrong && !option.isCorrect && choseRight !== true && selected === option.label;
              const isCorrect = choseRight && option.isCorrect;

              let buttonStyle = styles.optionButton;
              if (isCorrect) buttonStyle = [styles.optionButton, { backgroundColor: '#83DA40' }];
              else if (isPressed) buttonStyle = [styles.optionButton, { backgroundColor: '#E85E40' }];

              return (
                <TouchableOpacity
                  key={option.label}
                  style={styles.buttonStyle1}
                  disabled={choseRight}
                  onPress={() => {
                    if (option.isCorrect) {
                      setChoseRight(true);
                    } else {
                      setChoseWrong(true);
                      setSelected(option.label);
                    }
                  }}
                >
                  <FastImage
                    source={require('../assets/beeAnim.gif')}
                    style={styles.optionGif}
                    resizeMode={FastImage.resizeMode.contain}
                  />
                  <View style={buttonStyle}>
                    <Text style={styles.optionText}>{option.label}</Text>
                  </View>
                </TouchableOpacity> 
              );
            })}
          </View>

          <View style={[{ width: '100%', flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }, choseWrong && !choseRight && {justifyContent: 'space-between'}]}>
            {choseWrong && !choseRight && (
            <TouchableOpacity style={styles.questionCircle} onPress={()=>{setShowMistakePanel(true)}}>
              <Text style={{textAlign: 'center', alignSelf: 'center', fontSize: 16}}>?</Text>
            </TouchableOpacity>)}

            <TouchableOpacity
              style={choseRight ? styles.activeContinueButton : styles.continueButton}
              disabled={!choseRight}
              onPress={paragraphIndex === 5 ? handleLastParagraph : handleNextParagraph}
            >
              <Text style={styles.continueText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        {/* Tint */}
        {showMistakePanel && (
          <View style={{height: "100%", width: "100%", position: "absolute", zIndex: 1, backgroundColor: "rgba(0, 0, 0, 0.42)"}}></View>
        )}

        {/* Panels */}
        {showMistakePanel && (
          <MistakePanel mistakeText={mistakeText} setShowMistakePanel={setShowMistakePanel}></MistakePanel>
        )}
      </View>
    );
  }
};

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 20,
  },
  moduleTitle: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 5,
  },
  pageIndicator: {
    marginLeft: 'auto',
    fontWeight: '500',
    fontSize: 14,
    color: 'gray',
  },
  storyBubble: {
    backgroundColor: '#E7F0FF',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    padding: 14,
  },
  storyText: {
    fontSize: 15,
    lineHeight: 20,
    color: '#333',
  },
  storyImage: {
    width: '100%',
    height: 220,
    borderRadius: 12,
    marginBottom: 14,
  },
  question: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 15,
    color: '#333',
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 25,
  },
  optionButton: {
    width: '100%',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonStyle1: {
    width: '48%',
    borderRadius: 10,
    alignItems: 'center',
    //backgroundColor: 'orange'
  },
  optionText: {
    fontSize: 16,
    fontWeight: '500',
  },
  continueButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 10,
    borderColor: '#545454',
    borderWidth: 1,
  },
  activeContinueButton: {
    alignSelf: 'center',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 10,
    backgroundColor: '#DCECFC'
  },
  continueText: {
    fontSize: 16,
    fontWeight: '500',
  },
  questionCircle: {
    backgroundColor: '#D9D9D9',
    borderRadius: '100%',
    justifyContent: 'center',
    height: 45,
    width: 45
  },
  mistakePanel: {
    width: screenWidth*0.8,
    paddingHorizontal: 18,
    paddingTop: 34,
    paddingBottom: 22,
    backgroundColor: '#fff',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -screenWidth*0.4 }], 
    top: '15%',
    zIndex: 2,
    borderRadius: 15,
  },
  mistakeText: {
    fontSize: 15,
    lineHeight: 23
  },
  gif: {
    width: 100, // Adjust size as needed
    height: 100,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionGif: {
    width: 80,
    height: 80,
    position: "relative",
    left: 30
  }
});

export default Module1Tale;
