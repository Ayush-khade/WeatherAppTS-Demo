import * as React from "react";
import { View, Text, Button, TextInput, ToastAndroid, Image } from "react-native";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack";
import {RootStackParamList} from "./types";
import styles from './src/components/Styles';

type EnterCountryProps = NativeStackScreenProps<RootStackParamList, "EnterCountry">;

const EnterCountry: React.FC<EnterCountryProps> = ({ route, navigation }: props) => {
  
  const [text, onChangeText] = React.useState("");
  const [fill, onFill] = React.useState(true);

  const onFilled=(val: string)=> {
    ; if (val == "") { onFill(true) }
    else onFill(false)
    }

  const fetchDetails=(value: string)=> {
    fetch('https://restcountries.com/v3.1/name/' + value + '?fullText=true')
      .then((response) => response.json())
      .then((json) => {
        if(json.message==="Not Found"){          
            ToastAndroid.show("Please enter valid Country name !",ToastAndroid.SHORT);         
        }
       else { 
        var param = {
          capital:json[0].capital[0],
          lat:json[0].latlng[0],
          lng:json[0].latlng[1],
          popu:json[0].population,
          flag:json[0].flags.png
        };        
        navigation.navigate('CountryDetails', param);}
      })
      .catch((error) => { console.error(error); });
  }
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: "#e1e1e1" }}>
      <View style={{backgroundColor:"#d1d1d1",padding:40,width:"80%", alignItems: 'center',borderRadius:20}}>
          <Text style={styles.textHeading}>Weather App Demo</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter country"
            placeholderTextColor="#353535"
            onChangeText={(val) => { onChangeText(val); onFilled(val) }}
            value={text}
          >
          
          </TextInput>
          <Button
            title=" SUBMIT "
            onPress={() => { fetchDetails(text); }}
            disabled={fill}
          />
        </View>
    </View>
  );
};

type CountryDetailsProps = NativeStackScreenProps<RootStackParamList, "CountryDetails">;

const CountryDetails: React.FC<CountryDetailsProps> = ({ route, navigation }:props) => {
  function fetchWeather(value: string) {
    fetch('http://api.weatherstack.com/current?access_key=38354a657d7a3a01cfcdee8c9cac5db8&query=' + value)
      .then((response) => response.json())
      .then((json) => {
        var param = {
          temp:json.current.temperature,
          wSpeed:json.current.wind_speed,
          icon:json.current.weather_icons[0],
          preci:json.current.precip,
          cap:value
        };
        navigation.navigate('WeatherDetails', param);
      })
      .catch((error) => { console.error(error); });
  }


return (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-around",flexDirection:"column",backgroundColor:"#e1e1e1" }}>
    <View style={{flex:0.2}}>
        <Image
            style={{ width: 270, height: 180 }}
            source={{ uri: route.params.flag }}/>
    </View>
    <View style={{flex:0.4,flexDirection:'column',width:"90%"}}>

        <View style={{flex:1,flexDirection:'row',justifyContent:"flex-start"}}>

            <View style={{borderRadius:15,flex:1,backgroundColor:"#d1d1d1",margin:15,padding:10,justifyContent:"space-around",alignItems:"center"}}>
                <Text style={[styles.text]}>Capital</Text>
                <Text style={[styles.text,{fontSize:25,fontWeight:"700"}]}>{route.params.capital}</Text>
            </View>
            <View style={{borderRadius:15,flex:1,backgroundColor:"#d1d1d1",margin:15,padding:10,justifyContent:"space-around",alignItems:"center"}}>
                <Text style={styles.text}>Latitude</Text>
                <Text style={[styles.text,{fontSize:25,fontWeight:"700"}]}>{route.params.lat}</Text>
            </View>              
        </View>

        <View style={{flex:1,flexDirection:'row',justifyContent:"center"}}>
            <View style={{borderRadius:15,flex:1,backgroundColor:"#d1d1d1",margin:15,padding:10,justifyContent:"space-around",alignItems:"center"}}>
                <Text style={styles.text}>Longitude</Text>
                <Text style={[styles.text,{fontSize:25,fontWeight:"700"}]}>{route.params.lng}</Text>
            </View>
            
            <View style={{borderRadius:15,flex:1,backgroundColor:"#d1d1d1",margin:15,padding:10,justifyContent:"space-around",alignItems:"center"}}>
                <Text style={styles.text}>Population</Text>
                <Text style={[styles.text,{fontSize:25,fontWeight:"700"}]}>{route.params.popu}</Text>
            </View>
            
        </View>
        
    </View>
    
        <Button
            title="Capital Weather"
            onPress={() => { fetchWeather(route.params.capital); }}/>
   
  </View>
);
};

type WeatherDetailsProps = NativeStackScreenProps<RootStackParamList, "WeatherDetails">;

const WeatherDetails: React.FC<WeatherDetailsProps> = ({ route, navigation }: props) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: "space-around" ,backgroundColor:"#e1e1e1",flexDirection:"column" }}>
      <View style={{flex:0.4,justifyContent:"center"}}>
          <Text style={styles.textHeading}>Weather Details for - {route.params.cap}</Text>
      </View>
      <View style={{flex:0.6,flexDirection:'column',width:"90%"}}>
          <View style={{flex:1,flexDirection:'row',justifyContent:"flex-start"}}>
              <View style={{borderRadius:15,flex:1,backgroundColor:"#d1d1d1",margin:15,padding:10,justifyContent:"space-around",alignItems:"center"}}>
                  <Text style={[styles.text]}>Temperature</Text>
                  <Text style={[styles.text,{fontSize:35,fontWeight:"700"}]}>{route.params.temp}</Text>
              </View>
              <View style={{borderRadius:15,flex:1,backgroundColor:"#d1d1d1",margin:15,padding:10,justifyContent:"space-around",alignItems:"center"}}>
                  <Text style={styles.text}>Wind Speed</Text>
                  <Text style={[styles.text,{fontSize:35,fontWeight:"700"}]}>{route.params.wSpeed}</Text>
              </View>              
          </View>
          <View style={{flex:1,flexDirection:'row',justifyContent:"flex-start"}}>
              <View style={{borderRadius:15,flex:1,backgroundColor:"#d1d1d1",margin:15,padding:10,justifyContent:"space-around",alignItems:"center"}}>
                  <Text style={[styles.text]}>Precipitation</Text>
                  <Text style={[styles.text,{fontSize:35,fontWeight:"700"}]}>{route.params.preci}</Text>
              </View>
              <View style={{borderRadius:15,flex:1,backgroundColor:"#d1d1d1",margin:15,padding:10,justifyContent:"space-around",alignItems:"center"}}>
                  <Text style={styles.text}>Weather Icon</Text>
                  <Image style={{ width: 60, height: 60 }} source={{ uri: route.params.icon }}/>
              </View>              
          </View>
      </View>
      <View style={{height:100}}></View>
  </View>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="EnterCountry" screenOptions={{headerTitleAlign: 'center'}}>
        <Stack.Screen name='EnterCountry' component={EnterCountry} options={{
          title: 'Enter Country', headerStyle: {
            backgroundColor: '#e1e1e1'
          },
        }}/>
        <Stack.Screen name='WeatherDetails' component={WeatherDetails} options={{
          title: 'Weather Details', headerStyle: {
            backgroundColor: '#e1e1e1'
          },
        }}/>
        <Stack.Screen name='CountryDetails' component={CountryDetails} options={{
          title: 'Country Details', headerStyle: {
            backgroundColor: '#e1e1e1'
          },
        }}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;