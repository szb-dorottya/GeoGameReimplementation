import React from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import ShadowedTextContainer from '~/components/common/ShadowedTextContainer';
import TouchableItem from '~/components/common/TouchableItem';
import {Regions} from '~/constants/ConstantValues';
import * as CommonStyles from '~/theme/CommonStyles';

/**
 * @param {RegionListScreenProps} props
 * @returns
 */
const RegionListScreen = props => {
  return (
    <View style={styles.screen}>
      <FlatList
        data={Regions}
        renderItem={({item}) => (
          <TouchableItem
            onPress={() =>
              props.navigation.navigate('CountryList', {
                regionName: item.name,
                regionId: item.id,
              })
            }>
            <ShadowedTextContainer title={item.name} />
          </TouchableItem>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    ...CommonStyles.styles.screen,
    ...CommonStyles.styles.centered,
  },
});

export default RegionListScreen;
