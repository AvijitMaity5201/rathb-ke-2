import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const CookWithUs = () => {
  const [ingredients, setIngredients] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [people, setPeople] = useState(1);
  const [recipes, setRecipes] = useState([]);

  const cuisineTypes = ['Drinks', 'American', 'Chinese', 'French', 'Indian', 'Italian', 'Mexican', 'Thai', 'Japanese', 'Spanish'];
  const peopleCount = [1, 2, 3, 4, 5, 6, 7];

  // Updated function to use Gemini AI
  const getRecipe = async () => {
    try {
      const response = await axios.post('https://api.openai.com/v1/completions', {
        model: "text-davinci-003", // Replace with the correct Gemini AI model name
        prompt: `Create a recipe using the following details:
        Ingredients: ${ingredients}.
        Cuisine: ${cuisine}.
        Servings: ${people}.
        Recipe:`,
        max_tokens: 500, // Adjust as per your needs
        temperature: 0.7, // Adjust for creativity level
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer YOUR_API_KEY`, // Replace with your Gemini AI key
        },
      });

      // Assuming the AI response is in the `choices` array
      const aiResponse = response.data.choices[0].text.trim();

      // Example of setting AI-generated recipe
      setRecipes([{ id: Date.now().toString(), title: "AI Generated Recipe", instructions: aiResponse, image: 'https://via.placeholder.com/150' }]);
    } catch (error) {
      console.error('Error fetching AI-generated recipe:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.fridgeSection}>
        <Text style={{ fontSize: hp(3.8) }} className="font-semibold text-neutral-600">What's in your</Text>
        <Text style={{ fontSize: hp(3.8) }} className="font-semibold text-neutral-600">
          <Text className="text-amber-400">fridge?</Text>
        </Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="What ingredients do you have?"
        value={ingredients}
        onChangeText={setIngredients}
      />

      <View className="mx-4 space-y-1 mb-2">
        <Text style={{ fontSize: hp(2.5) }} className="text-amber-400">Cuisine</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.cuisineScroll}>
        <View style={styles.cuisineContainer}>
          {cuisineTypes.map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.cuisineButton, cuisine === type && styles.selectedCuisine]}
              onPress={() => setCuisine(type)}
            >
              <Text style={styles.cuisineText}>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <View className="mx-4 space-y-1 mb-2">
        <Text style={{ fontSize: hp(2.5) }} className="text-amber-400">Servings</Text>
      </View>

      <View style={styles.peopleContainer}>
        {peopleCount.map((count) => (
          <TouchableOpacity
            key={count}
            style={[styles.peopleButton, people === count && styles.selectedPeople]}
            onPress={() => setPeople(count)}
          >
            <Text style={styles.peopleText}>{count}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.getRecipeButton} onPress={getRecipe}>
        <Text style={styles.getRecipeText}>Get Recipe</Text>
      </TouchableOpacity>

      {/* Results Box for AI-generated recipes */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsTitle}>Recipe Results:</Text>
        <ScrollView style={styles.recipeList}>
          {recipes.map(recipe => (
            <View key={recipe.id} style={styles.recipeCard}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Image source={{ uri: recipe.image }} style={styles.recipeImage} />
              <Text>{recipe.instructions}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    paddingBottom: 40,
  },
  fridgeSection: {
    paddingTop: hp(5),
    paddingHorizontal: wp(4),
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  cuisineScroll: {
    marginBottom: 20,
  },
  cuisineContainer: {
    flexDirection: 'row',
  },
  cuisineButton: {
    width: 50,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
  },
  selectedCuisine: {
    backgroundColor: '#FFA500',
  },
  cuisineText: {
    fontSize: 10,
  },
  peopleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  peopleButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedPeople: {
    backgroundColor: '#FFA500',
  },
  peopleText: {
    fontSize: 14,
  },
  getRecipeButton: {
    backgroundColor: '#FFA500',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  getRecipeText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  resultsContainer: {
    marginTop: 20,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  recipeList: {
    marginTop: 10,
  },
  recipeCard: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    borderRadius: 5,
  },
});

export default CookWithUs;
