import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FlatList} from 'react-native-gesture-handler';
import {GameTypes, GameTypesObjects} from '~/constants/ConstantValues';
import Colors from '~/theme/Colors';
import {
  HeightDimension,
  MarginDimension,
  RadiusDimension,
  WidthDimension,
} from '~/theme/Dimen';
import FontSizes from '~/theme/FontSizes';

/**
 * @param {GuessGameProps} props
 * @returns {JSX.Element}
 */
const GuessTheCapitalGame = props => {
  const {data, onItemSelected} = props;

  return (
    <View>
      <View>
        <Text style={styles.question}>
          {
            GameTypesObjects.find(item => item.id === GameTypes.guessTheCapital)
              .name
          }{' '}
          of {data.question}
        </Text>
      </View>
      <View style={styles.list}>
        <FlatList
          data={data.options}
          keyExtractor={(item, index) => item + index}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.listItem}
              onPress={() => onItemSelected(item)}>
              <Text style={styles.centeredText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  question: {
    margin: MarginDimension.large,
    fontWeight: 'bold',
    fontSize: FontSizes.large,
    textAlign: 'center',
  },
  list: {
    flexDirection: 'row',
  },
  listItem: {
    width: WidthDimension.extraLarge,
    height: HeightDimension.large,
    backgroundColor: Colors.darkPink,
    margin: MarginDimension.small,
    alignSelf: 'center',
    justifyContent: 'center',
    borderBottomLeftRadius: RadiusDimension.large,
    borderBottomRightRadius: RadiusDimension.large,
  },
  centeredText: {
    textAlign: 'center',
    color: Colors.white,
    fontSize: FontSizes.medium,
    fontWeight: 'bold',
  },
});

export default GuessTheCapitalGame;
