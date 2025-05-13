import React, { useEffect, useState, useRef} from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width: screenWidth } = Dimensions.get('window');

const options = [
  { label: 'Worry', isCorrect: false },
  { label: 'Anger', isCorrect: false },
  { label: 'Sadness', isCorrect: true },
  { label: 'Confusion', isCorrect: false },
];

const dummyText =
  "Milo, the little fox cub, woke up to a cool breeze drifting through his burrow. He yawned, stretched, and reached for his favorite red cap—but it wasn’t on the shelf. Milo blinked and looked again. Still nothing. He sniffed the corners of the burrow, peeked under his leaf bed, and even checked his toy chest. Empty. He walked outside, dragging his paws on the ground, and sat by a big rock. His ears drooped, and his tail curled around him. Milo stared silently at the grass.";

const mistakeDummy = 'Milo felt happy because he finally found his favorite red cap after looking for it everywhere! Bella helped him search all over the forest, and just when they were about to give up, she spotted it high up in a tree. When Milo saw it, his eyes got big with excitement, and he jumped for joy as he pulled it down. This shows he was really happy and full of excitement. When we find something we love and thought was gone, it can make us feel super happy—just like Milo!'


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
  const { storyIndex, storyTitle } = route.params;

  const [storyText, setStoryText] = useState<String>('');
  const [imageUri, setImageUri] = useState<String>('');
  const [mistakeText, setMistakeText] = useState<String>('')
  
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [paragraphIndex, setParagraphIndex] = useState<number>(1)

  const [loadedText, setLoadedText] = useState<boolean>(false)
  const [loadedImage, setLoadedImage] = useState<boolean>(false)

  const [selected, setSelected] = useState<string | null>(null);
  const [choseWrong, setChoseWrong] = useState<boolean>(false)
  const [choseRight, setChoseRight] = useState<boolean>(false)

  const [showMistakePanel, setShowMistakePanel] = useState<boolean>(false)

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {

    const fetchText = async () => {
      try {
        // const response = await fetch(`https://your-api.com/stories/${storyIndex}&${paragraphIndex}/text`);
        // const data = await response.text();
        const data = dummyText;
        setStoryText(data);
        setMistakeText(mistakeDummy)
        setLoadedText(true);
      } catch (error) {
        console.error('Error fetching story text:', error);
      }
    };

    const fetchImage = async () => {
      try {
        const imageUrl = require('../assets/dummyIllustration.png');
        setImageUri(imageUrl);

        // Dynamically get image dimensions
        Image.getSize(
          Image.resolveAssetSource(imageUrl).uri,
          (originalWidth, originalHeight) => {
            const ratio = screenWidth / originalWidth;
            setImageDimensions({
              width: screenWidth-40,
              height: originalHeight * ratio,
            });
          },
          (error) => console.error('Failed to get image size', error)
        );
        setLoadedImage(true)
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    };

    fetchText();
    fetchImage();
  }, [storyIndex, paragraphIndex]);


  function handleNextParagraph(){
    setLoadedImage(false)
    setLoadedText(false)
    setChoseRight(false)
    setChoseWrong(false)
    setSelected(null)
    scrollRef.current?.scrollTo({ y: 0, animated: true });
    setParagraphIndex(paragraphIndex+1)
  }

   function handleLastParagraph(){
    navigation.navigate('WellDone')
  }


  if (!loadedImage || !loadedText){
    return (
      <View>
        <Text>Loading..</Text>
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
              source={imageUri}
              style={{
                width: imageDimensions.width,
                height: imageDimensions.height,
                borderBottomLeftRadius: 12,
                borderBottomRightRadius: 12,
                marginBottom: 40,
              }}
              resizeMode="cover"
            />
            </View>
          )}

          <Text style={styles.question}>
            Question: What did Milo feel when he couldn't find his red cap?
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
                  style={buttonStyle}
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
                  <Text style={styles.optionText}>{option.label}</Text>
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
          <MistakePanel mistakeText={mistakeDummy} setShowMistakePanel={setShowMistakePanel}></MistakePanel>
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
    width: '48%',
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
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
    paddingHorizontal: 16,
    paddingTop: 34,
    paddingBottom: 20,
    backgroundColor: '#fff',
    position: 'absolute',
    left: '50%',
    transform: [{ translateX: -screenWidth*0.4 }], // half of panel width,
    top: '15%',
    zIndex: 2,
    borderRadius: 15,
  },
  mistakeText: {
    fontSize: 15,
    lineHeight: 23
  }
});

export default Module1Tale;
