import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styled } from 'nativewind';

const StyledView = styled(View);
const StyledText = styled(Text);
const StyledPressable = styled(Pressable);

const BottomNavbar = () => {
  const navigation = useNavigation();

  return (
    <StyledView className="flex-row justify-around items-center bg-gray-100 border-t border-gray-200 h-16 absolute bottom-0 left-0 right-0">
      <StyledPressable
        className="flex-1 justify-center items-center"
        onPress={() => navigation.navigate('Home')}
      >
        <View>
            <Image source={require("../../assets/images/home.png")}/>
        </View>
      </StyledPressable>
      <StyledPressable
        className="flex-1 justify-center items-center"
        onPress={() => navigation.navigate('Add')}
      >
        <View>
            <Image source={require("../../assets/images/add.png")}/>
        </View>
        
      </StyledPressable>
      <StyledPressable
        className="flex-1 justify-center items-center"
        onPress={() => navigation.navigate('Favourites')}
      >
         <View>
            <Image source={require("../../assets/images/favourites.png")}/>
        </View>
      </StyledPressable>
      <StyledPressable
        className="flex-1 justify-center items-center"
        onPress={() => navigation.navigate('Community')}
      >
         <View>
            <Image source={require("../../assets/images/community.png")}/>
        </View>
      </StyledPressable>
      
    </StyledView>
  );
};

export default BottomNavbar;