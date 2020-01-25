/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { WebView } from 'react-native-webview';
import {BleManager} from 'react-native-ble-plx';

class BleComponent extends React.Component {
  constructor(props){
    super(props);
    this.manager = new BleManager();
    //requestBluetoothPermission(this);
  }

  render(){return (null)}

  componentDidMount() {
    const subscription = this.manager.onStateChange((state) => {
        console.log("BLE state: " + state);
        if (state === 'PoweredOn') {
            this.scanAndConnect();
            subscription.remove();
        }
    }, true);
  }

  scanAndConnect() {
    console.log("Scanning");
    this.manager.startDeviceScan(null, null, (error, device) => {
        if (error) {
          console.log(error);
            // Handle error (scanning will be stopped automatically)
            return
        }

        // Check if it is a device you are looking for based on advertisement data
        // or other criteria.
        if (device.name === 'TI BLE Sensor Tag' || 
            device.name === 'MRCP Node') {
            
            // Stop scanning as it's not necessary if you are scanning for one device.
            this.manager.stopDeviceScan();

            // Proceed with connection.
            device.connect()
            .then((device) => {
                return device.discoverAllServicesAndCharacteristics()
            })
            .then((device) => {
              // Do work on device with services and characteristics
            })
            .catch((error) => {
                // Handle errors
            });
        }
    });
  }
}

async function requestBluetoothPermission(comp) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'MRCP Camera Permission',
        message:
          'MRCP needs access to your camera ' +
          'to use Mixed Reality.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      comp.state.isLoading = false;
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

class MyWeb extends React.Component {
  constructor(props){
    super(props);
    this.state = {isLoading: true};

    requestCameraPermission(this);
  }

  render() {
    let webView;
    if(!this.isLoading){
      return(
        <WebView
        mediaPlaybackRequiresUserAction={false}
        source={{ uri: 'file:///android_asset/index.html'}}
        style={{height: Dimensions.get('window').height}}
      />
      );
    }
    return (
      <Text style={styles.sectionTitle}>Loading...</Text>
      /*<WebView
        source={{ html: '<!doctype HTML><html><script src="https://aframe.io/releases/0.9.2/aframe.min.js"></script><script src="https://raw.githack.com/jeromeetienne/AR.js/2.0.8/aframe/build/aframe-ar.js"></script> <body style="margin : 0px; overflow: hidden;">    <a-scene embedded arjs>      <a-marker preset="hiro">          <a-box position="0 0.5 0" material="color: yellow;"></a-box>      </a-marker>      <a-entity camera></a-entity>    </a-scene>  </body></html>' }}
        style={{ marginTop: 20, height: 500 }}
      />*/
    );
  }
}

async function requestCameraPermission(comp) {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      {
        title: 'MRCP Camera Permission',
        message:
          'MRCP needs access to your camera ' +
          'to use Mixed Reality.',
        buttonNeutral: 'Ask Me Later',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('You can use the camera');
      comp.state.isLoading = false;
    } else {
      console.log('Camera permission denied');
    }
  } catch (err) {
    console.warn(err);
  }
}

const App: () => React$Node = () => {
  return (
    <>
      <BleComponent></BleComponent>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
            <MyWeb></MyWeb>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
