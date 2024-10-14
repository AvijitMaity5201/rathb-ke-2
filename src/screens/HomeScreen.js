import { View, Text, ScrollView, Image, TextInput, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { MagnifyingGlassIcon } from 'react-native-heroicons/outline';
import axios from 'axios';
import Recipes from '../components/recipes';
import BottomNavbar from '../components/BottomNavbar';
import Carousel from 'react-native-snap-carousel';

const cuisineImages = {
  Indian: require('../../assets/images/Indian.png'),
  American: require('../../assets/images/American.png'),
  Thai: require('../../assets/images/Thai.png'),
  Mexican: require('../../assets/images/Mexican.png'),
  Japanese: require('../../assets/images/Japanese.png'),
  Chinese: require('../../assets/images/Chinese.png'),
  French: require('../../assets/images/French.png'),
  Greek: require('../../assets/images/Greek.png'),
  Italian: require('../../assets/images/Italian.png'),
  Spanish: require('../../assets/images/Spanish.png'),
  British: require('../../assets/images/British.png'),
  Jamaican: require('../../assets/images/Jamaican.png'),
};

export default function HomeScreen() {
  const [activeCuisine, setActiveCuisine] = useState('Indian');
  const [meals, setMeals] = useState([]);
  const [carouselItems, setCarouselItems] = useState([]);

  const cuisineList = [
    'Indian', 'American', 'Thai', 'Mexican',
    'Japanese', 'Chinese', 'French', 'Greek',
    'Italian', 'Spanish', 'British', 'Jamaican'
  ];

  useEffect(() => {
    getRecipes(); // Fetch default cuisine recipes (Indian)
    fetchCarouselItems(); // Fetch data for the carousel
  }, []);

  const fetchCarouselItems = async () => {
    const selectedCuisines = ['French', 'Greek', 'Italian', 'Spanish', 'Mexican'];
    let fetchedItems = [];

    try {
      for (const cuisine of selectedCuisines) {
        const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`);
        if (response && response.data && response.data.meals) {
          const filteredMeals = response.data.meals.filter(meal => !meal.strMeal.includes('Beef'));
          if (filteredMeals.length > 0) {
            fetchedItems.push(filteredMeals[0]);
          }
        }
      }
      setCarouselItems(fetchedItems);
    } catch (error) {
      console.error("Error fetching carousel data: ", error);
    }
  };

  const handleChangeCuisine = (cuisine) => {
    getRecipes(cuisine);
    setActiveCuisine(cuisine);
  };

  const getRecipes = async (cuisine = "Indian") => {
    try {
      const response = await axios.get(`https://www.themealdb.com/api/json/v1/1/filter.php?a=${cuisine}`);
      if (response && response.data && response.data.meals) {
        setMeals(response.data.meals);
      }
    } catch (err) {
      console.error('Error fetching recipes:', err.message);
    }
  };

  const renderCarouselItem = ({ item }) => {
    return (
      <View style={{
        backgroundColor: 'orange',
        borderRadius: 10,
        padding: 10,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        marginBottom: 20,
        overflow: 'hidden',
      }}>
        <Image
          source={{ uri: item.strMealThumb }}
          style={{
            height: hp(20),
            width: wp(80),
            borderRadius: 10,
            resizeMode: 'cover',
            marginBottom: 5,
          }}
        />
        <Text style={{
          textAlign: 'center',
          fontSize: hp(2.3),
          fontWeight: 'bold',
          color: 'white'
        }}>
          {item.strMeal}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 50 }} // Keep bottom padding for content
      >
        {/* Image and Search Bar */}
        <View style={{ position: 'relative', width: wp(100) }}>
          <Image
            source={require('../../assets/images/topimg.jpg')} // Your image path
            style={{
              width: wp(100),  // Full width of the screen
              height: hp(30),  // Adjust height as needed
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              resizeMode: 'cover', // Ensures the image covers the area without distorting aspect ratio
            }}
          />

          {/* Search bar */}
          <View style={{
            position: 'absolute',
            top: hp(20), // Positioning the search bar over the image
            left: wp(4),
            right: wp(4),
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 225, 0.8)', // Slightly transparent background
            borderRadius: 25,
            padding: 7,
            zIndex: 1, // Ensure it's above the image
          }}>
            <TextInput
              placeholder='Search any recipe'
              placeholderTextColor='gray'
              style={{ fontSize: hp(2), flex: 1, paddingLeft: 15 }}
            />
            <TouchableOpacity style={{
              backgroundColor: 'white',
              borderRadius: 25,
              padding: 8,
            }}>
              <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="black" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Horizontal scroll for cuisine boxes */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 20, paddingHorizontal: 10 }}
        >
          {cuisineList.map((cuisine, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleChangeCuisine(cuisine)}
              style={{
                width: hp(10),
                height: hp(10),
                borderRadius: hp(5),
                backgroundColor: activeCuisine === cuisine ? 'orange' : '#f0f0f0',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: wp(3),
              }}
            >
              <Image
                source={cuisineImages[cuisine]}
                style={{ width: hp(6), height: hp(6), borderRadius: hp(6) }}
              />
              <Text style={{ textAlign: 'center', fontSize: hp(1.3), marginTop: 2 }}>
                {cuisine}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Greetings and punchline */}
        <View style={{ marginHorizontal: wp(4), marginBottom: 10 }}>
          <Text style={{ fontSize: hp(3), color: 'black' }}>
            What's <Text style={{ fontSize: hp(3.5), color: '#FBBF24' }}>your desire</Text> today?
          </Text>
        </View>

        {/* Carousel for meal images */}
        <View>
          <Carousel
            data={carouselItems}
            renderItem={renderCarouselItem}
            sliderWidth={wp(100)}
            itemWidth={wp(85)}
            autoplay={true}
            loop={true}
          />
        </View>

        {/* Recipes */}
        <View>
          <Recipes meals={meals} categories={cuisineList} />
        </View>
      </ScrollView>
      <BottomNavbar />
    </View>
  );
}
