import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';
import { db, storage } from '../../configs/FirebaseConfig';
import * as FileSystem from 'expo-file-system';

const AddRecipeScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [serves, setServes] = useState('');
  const [cookTime, setCookTime] = useState('');
  const [ingredients, setIngredients] = useState([]); // Changed to array
  const [method, setMethod] = useState([]); // Changed to array
  const [newIngredient, setNewIngredient] = useState('');
  const [newMethod, setNewMethod] = useState('');
  const [image, setImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const requestCameraRollPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission to access camera roll is required!');
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking image: ", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const uploadImage = async () => {
    if (image) {
      try {
        const { uri } = await FileSystem.getInfoAsync(image);
        const blob = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.onload = () => resolve(xhr.response);
          xhr.onerror = () => reject(new TypeError('Network request failed'));
          xhr.responseType = 'blob';
          xhr.open('GET', uri, true);
          xhr.send(null);
        });

        const filename = `recipeImages/${new Date().getTime()}_${image.substring(image.lastIndexOf('/') + 1)}`;
        const storageRef = ref(storage, filename);

        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
      } catch (error) {
        console.error("Error uploading image: ", error);
        throw error;
      }
    }
    return null;
  };

  const deleteImage = async (imageUrl) => {
    if (imageUrl) {
      try {
        const imageRef = ref(storage, imageUrl);
        await deleteObject(imageRef);
      } catch (error) {
        console.error("Error deleting image: ", error);
      }
    }
  };

  const addRecipe = async () => {
    if (!title || !description || ingredients.length === 0 || method.length === 0) {
      Alert.alert("Missing Information", "Please fill in all required fields.");
      return;
    }

    setIsLoading(true);
    let recipeImage = null;

    try {
      recipeImage = await uploadImage();

      const docRef = await addDoc(collection(db, 'data'), {
        Title: title,
        Description: description,
        Serves: serves,
        'Cook time': cookTime,
        ingredients: ingredients,
        Method: method,
        RecipeImage: recipeImage,
      });

      console.log("Recipe added with ID: ", docRef.id);
      Alert.alert("Success", "Recipe added successfully!");
      navigation.goBack();
    } catch (error) {
      console.error("Error in addRecipe: ", error);
      Alert.alert("Error", "Failed to add recipe. Please check your network connection and try again.");
      if (recipeImage) {
        await deleteImage(recipeImage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
  };

  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients(prev => [...prev, newIngredient.trim()]);
      setNewIngredient('');
    } else {
      Alert.alert("Missing Ingredient", "Please enter an ingredient.");
    }
  };

  const removeIngredient = (index) => {
    setIngredients(prev => prev.filter((_, i) => i !== index));
  };

  const addStep = () => {
    if (newMethod.trim()) {
      setMethod(prev => [...prev, newMethod.trim()]);
      setNewMethod('');
    } else {
      Alert.alert("Missing Step", "Please enter a method step.");
    }
  };

  const removeStep = (index) => {
    setMethod(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <TouchableOpacity style={styles.imagePicker} onPress={pickImage} disabled={isLoading}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Text style={styles.imagePlaceholder}>Pick an image</Text>
        )}
      </TouchableOpacity>

      {image && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDeleteImage}>
          <Text style={styles.deleteButtonText}>Delete Image</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.input}
        placeholder="Title"
        value={title}
        onChangeText={setTitle}
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Serves"
        value={serves}
        onChangeText={setServes}
        keyboardType="numeric"
        editable={!isLoading}
      />
      <TextInput
        style={styles.input}
        placeholder="Cook Time (in minutes)"
        value={cookTime}
        onChangeText={setCookTime}
        keyboardType="numeric"
        editable={!isLoading}
      />

      <Text style={styles.sectionHeader}>Ingredients</Text>
      <FlatList
        data={ingredients}
        renderItem={({ item, index }) => (
          <View style={styles.ingredientItem}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => removeIngredient(index)}>
              <Text style={styles.deleteItemText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder="Add Ingredient"
        value={newIngredient}
        onChangeText={setNewIngredient}
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={addIngredient}
        disabled={isLoading}
      >
        <Text style={styles.addButtonText}>Add Ingredient</Text>
      </TouchableOpacity>

      <Text style={styles.sectionHeader}>Method</Text>
      <FlatList
        data={method}
        renderItem={({ item, index }) => (
          <View style={styles.methodItem}>
            <Text>{item}</Text>
            <TouchableOpacity onPress={() => removeStep(index)}>
              <Text style={styles.deleteItemText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
      <TextInput
        style={styles.input}
        placeholder="Add Step"
        value={newMethod}
        onChangeText={setNewMethod}
        editable={!isLoading}
      />
      <TouchableOpacity 
        style={styles.addButton} 
        onPress={addStep}
        disabled={isLoading}
      >
        <Text style={styles.addButtonText}>Add Step</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.addButton, isLoading && styles.disabledButton]} 
        onPress={addRecipe}
        disabled={isLoading}
      >
        <Text style={styles.addButtonText}>
          {isLoading ? "Adding Recipe..." : "Add Recipe"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 50, // Ensures space at the bottom
  },
  imagePicker: {
    width: '100%',
    height: 150,
    borderWidth: 1,
    borderColor: 'orange',
    backgroundColor: 'gray',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 30,
  },
  imagePlaceholder: {
    color: '#aaa',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  sectionHeader: {
    fontSize: 17,
    color:'orange',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  ingredientItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  methodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  deleteItemText: {
    color: '#ff4d4d',
  },
  addButton: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#aaa',
  },
});

export default AddRecipeScreen;
