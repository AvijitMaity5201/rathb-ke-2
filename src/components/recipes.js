import { View, Text, Pressable, Alert } from 'react-native';
import React, { useState } from 'react';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Loading from './loading';
import { CachedImage } from '../helpers/image';
import { useNavigation } from '@react-navigation/native';

export default function Recipes({ categories, meals }) {
  const navigation = useNavigation();
  const [savedRecipes, setSavedRecipes] = useState([]); // Step 1: Define state for saved recipes

  const saveRecipe = (recipe) => {
    // Step 2: Create the save function
    if (savedRecipes.some((saved) => saved.idMeal === recipe.idMeal)) {
      Alert.alert("Recipe already saved", "This recipe is already in your saved recipes.");
      return;
    }
    setSavedRecipes((prevRecipes) => [...prevRecipes, recipe]);
    Alert.alert("Saved", "Recipe saved successfully!");
  };

  return (
    <View className="mx-4 space-y-3">
      <Text style={{ fontSize: hp(3) }} className="font-semibold text-neutral-600">Recipes</Text>
      <View>
        {
          categories.length === 0 || meals.length === 0 ? (
            <Loading size="large" className="mt-20" />
          ) : (
            meals.map((item, index) => (
              <Animated.View key={item.idMeal} entering={FadeInDown.delay(index * 100).duration(600).springify().damping(12)}>
                <RecipeCard item={item} index={index} navigation={navigation} onSave={saveRecipe} />
              </Animated.View>
            ))
          )
        }
      </View>
    </View>
  );
}

const RecipeCard = ({ item, index, navigation, onSave }) => {
  return (
    <Pressable
      style={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        marginBottom: hp(3),
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: hp(1),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
        width: '100%', // Set width to 100% to occupy the available space
      }}
      onPress={() => navigation.navigate('RecipeDetail', { ...item })}
    >
      {/* Image on top */}
      <CachedImage
        uri={item.strMealThumb}
        style={{
          width: wp(86),
          height: hp(27),
          borderRadius: 10,
          marginBottom: hp(1),
        }}
        className="bg-black/5"
      />

      {/* Text details below the image */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: hp(2.7), fontWeight: 'bold', textAlign: 'left' }}>
            {item.strMeal.length > 20 ? item.strMeal.slice(0, 20) + '...' : item.strMeal}
          </Text>
          <Text numberOfLines={1} style={{ fontSize: hp(1.6), color: 'gray', textAlign: 'left' }}>
            {`servings 2    time 30min.`}
          </Text>
        </View>
        {/* Save button with orange background */}
        <Pressable onPress={() => onSave(item)} style={{ marginLeft: wp(2), padding: hp(1), backgroundColor: '#FFA500', borderRadius: 5 }}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Save Recipe</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
