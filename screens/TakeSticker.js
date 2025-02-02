import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Share,
  useWindowDimensions,
} from "react-native";
import { Camera } from "expo-camera";
import bojack from "../assets/Peace.png";
import sendto from "../assets/send.png";
const WINDOW_HEIGHT = Dimensions.get("window").height;
const closeButtonSize = Math.floor(WINDOW_HEIGHT * 0.032);
const captureSize = Math.floor(WINDOW_HEIGHT * 0.09);
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from 'expo-media-library';
import { Ionicons, Feather} from "@expo/vector-icons";

export default function App({navigation}) {

  const [hasPermission, setHasPermission] = useState(null);
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back);
  const [isPreview, setIsPreview] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [imageURI, setImageURI] = useState(null);
  const cameraRef = useRef();
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const onCameraReady = () => {
    setIsCameraReady(true);
  };
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true, skipProcessing: true };
      const data = await cameraRef.current.takePictureAsync(options);
     
    //const imageURI = await viewShotRef.current.capture();
   
      const source = data.uri;
      if (source) {
        await cameraRef.current.pausePreview();
        setIsPreview(true);
        setImageURI(source);

        console.log("picture source", source);
        console.log("taking picture");
      }
    }
  };
 
  const switchCamera = () => {
    if (isPreview) {
      return;
    }
    setCameraType((prevCameraType) =>
      prevCameraType === Camera.Constants.Type.back
        ? Camera.Constants.Type.front
        : Camera.Constants.Type.back
    );
  };
  const cancelPreview = async () => {
    await cameraRef.current.resumePreview();
    setIsPreview(false);
  };
  const renderCancelPreviewButton = () => (
    <View style = {styles.container}>
      <TouchableOpacity onPress={cancelPreview} style={styles.closeButton}>
        <Ionicons
          name={"close"}
          size={32}
          style={{ marginRight: 15, top: 15,   transform: [{rotateZ: "90deg"}]}}
          color={"#FFFFFF"}
              
        />
      </TouchableOpacity>
      <View style={styles.control2}>
      <Feather name="type" 
           
            color={"#FFFFFF"}
            size={30}/>
      <Feather name="edit-2" 
           
           color={"#FFFFFF"}
           size={30}/>
           <Feather name="scissors" 
           style={{transform: [{rotateZ: "270deg"}]}}
           color={"#FFFFFF"}
           size={30}/>
           <Ionicons
          name={"musical-notes"}
          size={30}
        
          color={"#FFFFFF"}         
        />
        <Ionicons
          name={"attach-outline"}
          style={{transform: [{rotateZ: "45deg"}]}}
          size={30}
        
          color={"#FFFFFF"}         
        />
      </View>
      <TouchableOpacity style = {{
        flex: 1,
        alignItems: 'flex-end',

      }}onPress={captureViewShot}>
      <Image  style={{
         height: 79,
          width: '100%',
            top: 750,
          }}
          source = {sendto}/>
      </TouchableOpacity>
      
    </View>
  );
  

  const renderCaptureControl = () => (
   <View style = {styles.container}>
      <View style={styles.control}>
        <View style={styles.snappy}>
        <TouchableOpacity disabled={!isCameraReady} onPress={switchCamera}>
        <Ionicons
              name={"repeat-outline"}
              size={40}
              style={{ marginRight: 5 ,   transform: [{rotateZ: "90deg"}]}}
              color={"#FFFFFF"}
              
            />
        </TouchableOpacity>
        <Ionicons
              name={"flash"}
              size={35}
              style={{ marginRight: 5 }}
              color={"#FFFFFF"}
          />
        <Ionicons
          name={"musical-notes"}
          size={35}
          style={{ marginRight: 5 }}
          color={"#FFFFFF"}         
        />
        </View>
      </View>
      <View>
        <TouchableOpacity onPress={()=>
        {
          navigation.navigate("Main");
        }}>
      <Ionicons
              name={"chevron-down"}
              size={35}
              style={{ left: 20 , top: 30,}}
              color={"#FFFFFF"}
               />
               </TouchableOpacity>
      </View>
      <View style={styles.bubble}>
          <TouchableOpacity
            activeOpacity={0.7}
            disabled={!isCameraReady}
            onPress={takePicture}
            style= {styles.capture}>
            </TouchableOpacity>
          <Ionicons
              name={"happy-outline"}
              size={40}
              style={{ left: 10 }}
              color={"#FFFFFF"}
               />
         </View>
         
          </View>       
  );
    async function captureViewShot()
    {
      
      // const imageURI = await viewShotRef.current.capture();
      // MediaLibrary.requestPermissionsAsync()
      // MediaLibrary.saveToLibraryAsync(imageURI);
     console.log("capturing picture", imageURI);
     navigation.navigate("ShareScreen");
    }
  const viewShotRef = useRef();
  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text style={styles.text}>No access to camera</Text>;
  }

  return (
    <ViewShot ref={viewShotRef} style={{flex: 1}} captureMode="mount" options= {{format:'png' , quality: 1.0,}}> 

    <SafeAreaView style={styles.container}>
 
    
          
      <Camera
        ref={cameraRef}
        style={styles.container}
        type={cameraType}
        onCameraReady={onCameraReady}
        onMountError={(error) => {
          console.log("cammera error", error);
        }}
      />
    
      <View style={styles.container}>
       
      <Image  style={{
            resizeMode: 'contain',
            height: 200,
            width: 201,
            top: 500,
          }}
          source = {bojack}/>      
          {isPreview && renderCancelPreviewButton() }
        {!isPreview && renderCaptureControl()}
      </View>
      
    </SafeAreaView>
    </ViewShot>
  );
}


const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    left: 15,
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
    zIndex: 2,
  },
  media: {
    ...StyleSheet.absoluteFillObject,
  },
  closeCross: {
    width: "68%",
    height: 1,
    backgroundColor: "white",
  },
  control: {
    position: "absolute",
    flexDirection: "column",
    width: "100%",
    height: "25%",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  control2: {
    position: "absolute",
    flexDirection: "column",
    right: 15,
    top: 35,
    width: "100%",
    height: "30%",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },

  capture: {
    borderColor: "#f5f6f5",
    borderWidth: 4,
    height: 95,
    width: 95,
    left: "20%",
    borderRadius: Math.floor( 100/ 2),
    marginHorizontal: 31,
  },
  recordIndicatorContainer: {
    flexDirection: "row",
    position: "absolute",
    top: 25,
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    opacity: 0.7,
  },
  recordTitle: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
  },
  recordDot: {
    borderRadius: 3,
    height: 6,
    width: 6,
    backgroundColor: "#ff0000",
    marginHorizontal: 5,
  },
  text: {
    color: "#fff",
  },
  bubble: {
    position: "absolute",
    flexDirection: "row",
    bottom: 38,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  snappy:
  {
    position: 'absolute',
    width: 45,
    height: 155,
    right:10,
    top: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    borderRadius: 20,
  },
});