import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import LoadingIndicator from '~/components/common/LoadingIndicator';
import {
  GameTypes,
  GameTypesValues,
  HelperButtonsLabel,
} from '~/constants/ConstantValues';
import {getDurationString} from '~/helpers/Utils';
import {
  generateGuessTheNeighbourQuestions,
  generateQuestionsAndAnswers,
} from '~/service/GenerateQuestionsAndAnswers';
import * as CommonStyles from '~/theme/CommonStyles';
import * as statisticsActions from '~/store/actions/statistics';
import {useDispatch} from 'react-redux';
import TimeElapsed from '~/components/game/TimeElapsed';
import {MarginDimension} from '~/theme/Dimen';
import FontSizes from '~/theme/FontSizes';
import Game from '~/components/game/Game';

/**
 * @param {import('@react-navigation/core').CompositeScreenProps<
 *            import('@react-navigation/native-stack').NativeStackScreenProps<GameNavigationParamList, 'Gaming'>,
 *            import('@react-navigation/core').CompositeScreenProps<
 *                import('@react-navigation/bottom-tabs').BottomTabScreenProps<BottomTabBarParamList>,
 *                import('@react-navigation/core').CompositeScreenProps<
 *                  import('@react-navigation/native-stack').NativeStackScreenProps<MainNavigationParamList>,
 *                  import('@react-navigation/native-stack').NativeStackScreenProps<ModalScreensParamList>>
 *                >
 *        >} props
 * @returns {JSX.Element}
 */
const GameScreen = props => {
  const {data} = props.route.params;

  /**
   * @type {ComponentState<number>}
   */
  const [currentIndex, setCurrentIndex] = useState(0);

  /**
   * @type {ComponentState<Questions[]>}
   */
  const [questions, setQuestions] = useState();

  /**
   * @type {ComponentState<boolean>}
   */
  const [isLoading, setIsLoading] = useState(false);

  /**
   * @type {React.MutableRefObject<Date>}
   */
  const gameStartTime = useRef();

  /**
   * @type {React.MutableRefObject<number>}
   */
  const numberOfCorrectAnswers = useRef(0);

  /**
   * @type {React.MutableRefObject<QuestionStatistic[]>}
   */
  const givenAnswers = useRef([]);

  const dispatch = useDispatch();

  /**
   * @param {string} item
   */
  const onItemSelected = item => {
    givenAnswers.current[currentIndex].givenAnswer = item;

    if (item === questions[currentIndex].correctAnswer) {
      numberOfCorrectAnswers.current++;
    }

    if (currentIndex + 1 !== data.numOfQuestions) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onEndGame();
    }
  };

  const onEndGame = () => {
    const gameEndTime = new Date();

    const seconds =
      (gameEndTime.getTime() - gameStartTime.current.getTime()) / 1000;

    /**
     * @type {StatisticsDataWithQuestions}
     */
    const gameData = {
      data: {
        correctAns: numberOfCorrectAnswers.current,
        date: gameStartTime.current.toDateString(),
        time: gameStartTime.current.toTimeString().substr(0, 8),
        duration: getDurationString(seconds),
      },
      questions: givenAnswers.current,
      type: GameTypes[data.gameType],
    };

    dispatch(statisticsActions.savePlayedGameData(gameData));

    props.navigation.navigate('ModalScreens', {
      screen: 'EndGameModal',
      params: {
        data: gameData,
        onBack: () => {
          props.navigation.navigate('Statistics');
        },
      },
    });
  };

  const getData = useCallback(async () => {
    setIsLoading(true);

    /**
     * @type {Questions[]}
     */
    var questionResult;
    switch (data.gameType) {
      case GameTypes.guessTheCapital:
        questionResult = await generateQuestionsAndAnswers(
          data.region,
          data.numOfQuestions,
          c => c.capital,
          c => c.name,
        );
        break;
      case GameTypes.guessTheFlag:
        questionResult = await generateQuestionsAndAnswers(
          data.region,
          data.numOfQuestions,
          c => c.name,
          c => c.flag,
        );
        break;
      case GameTypes.guessTheNeighbour:
        questionResult = await generateGuessTheNeighbourQuestions(
          data.region,
          data.numOfQuestions,
        );
        break;
      default:
        break;
    }

    for (const item of questionResult) {
      givenAnswers.current.push({
        correctAnswer: item.correctAnswer,
        givenAnswer: '',
        question: GameTypes[data.gameType],
        questionEnding: item.question,
      });
    }

    gameStartTime.current = new Date();
    setQuestions(questionResult);
    setIsLoading(false);
  }, [data]);

  useEffect(() => {
    getData();
  }, [data, getData]);

  return (
    <>
      {isLoading && !questions && (
        <View
          style={{
            ...CommonStyles.styles.screen,
            ...CommonStyles.styles.centered,
          }}>
          <LoadingIndicator />
        </View>
      )}
      {!isLoading && questions && (
        <ScrollView>
          <View style={styles.rowContainer}>
            {questions && (
              <>
                <View style={CommonStyles.styles.screen}>
                  <View style={styles.paginationContainer}>
                    <Text style={styles.text}>Page:</Text>
                    <Text style={styles.text}>
                      {currentIndex + 1}/
                      {props.route.params.data.numOfQuestions}
                    </Text>
                  </View>
                </View>
                <View style={CommonStyles.styles.screen}>
                  <TimeElapsed startTime={gameStartTime.current.getTime()} />
                </View>
              </>
            )}
          </View>
          <View
            style={{
              ...CommonStyles.styles.screen,
              ...CommonStyles.styles.centered,
            }}>
            {questions && (
              <Game
                data={{
                  options: questions[currentIndex].options,
                  question: questions[currentIndex].question,
                }}
                onItemSelected={onItemSelected}
                givenAnswer={givenAnswers.current[currentIndex].givenAnswer}>
                <>
                  {data.gameType === GameTypes.guessTheFlag && (
                    <>
                      <Text style={styles.question}>
                        {GameTypesValues[data.gameType]}
                      </Text>
                      <Image
                        resizeMode={'cover'}
                        style={styles.image}
                        source={{
                          uri: `${questions[currentIndex].question}`,
                        }}
                      />
                    </>
                  )}
                  {data.gameType !== GameTypes.guessTheFlag && (
                    <Text style={styles.question}>{`${
                      GameTypesValues[data.gameType]
                    } of ${questions[currentIndex].question}`}</Text>
                  )}
                </>
              </Game>
            )}
          </View>
          <View style={styles.buttonContainer}>
            <Button
              disabled={currentIndex - 1 !== -1 ? false : true}
              title={HelperButtonsLabel.back}
              onPress={() => {
                setCurrentIndex(prev => prev - 1);
              }}
            />
            <Button
              disabled={
                currentIndex + 1 !== props.route.params.data.numOfQuestions
                  ? false
                  : true
              }
              title={HelperButtonsLabel.next}
              onPress={() => {
                setCurrentIndex(prev => prev + 1);
              }}
            />
            <Button
              title={HelperButtonsLabel.submit}
              onPress={() => {
                onEndGame();
              }}
            />
          </View>
        </ScrollView>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: MarginDimension.medium,
  },
  paginationContainer: {
    marginTop: MarginDimension.large,
    marginLeft: MarginDimension.extraLarge,
  },
  text: {
    fontSize: FontSizes.medium,
  },
  rowContainer: {
    flexDirection: 'row',
  },
  ...CommonStyles.gameComponentStyles,
});

export default GameScreen;
