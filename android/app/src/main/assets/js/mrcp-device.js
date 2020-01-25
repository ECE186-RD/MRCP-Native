var characteristic_tx;
var characteristic_rx;
var device;
var button = document.querySelector('#device_button');
var led_on;

async function BLEconnect(){
  try {
    console.log('Requesting Bluetooth Device...');
    device  = await navigator.bluetooth.requestDevice({
        filters: [{services: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']}]});
        //acceptAllDevices: true, optionalServices: ['6e400001-b5a3-f393-e0a9-e50e24dcca9e']});
  
    console.log('Connecting to GATT Server...');
    const server = await device.gatt.connect();
  
    console.log('Getting Service...');
    const service = await server.getPrimaryService('6e400001-b5a3-f393-e0a9-e50e24dcca9e');
  
    console.log('Getting Characteristic TX...');
    characteristic_tx = await service.getCharacteristic('6e400002-b5a3-f393-e0a9-e50e24dcca9e');

    console.log('Getting Characteristic RX...');
    characteristic_rx = await service.getCharacteristic('6e400003-b5a3-f393-e0a9-e50e24dcca9e');
    characteristic_rx.addEventListener('characteristicvaluechanged', handleLedStatusChange);
    characteristic_rx.startNotifications();
    console.log('Done');
  } catch(error) {
    console.log(error);
  }
  return Promise.resolve();
}


async function buttonPress(){
  if(device == null){
    button.innerHTML = "Connecting";
    await BLEconnect();
  }else{
    let encoder = new TextEncoder('utf-8');
    let sendMsg = encoder.encode((led_on ? 'OFF' : 'ON').toString());
    console.log('Writing Characteristic...');
    button.innerHTML = 'Loading';
    await characteristic_tx.writeValue(sendMsg);
  }
}

function handleLedStatusChange(event){
  var status = document.querySelector('#device_status');
  status.style.display = 'block';
  let decoder = new TextDecoder("utf-8");
  led_on = parseInt(decoder.decode(event.target.value)) == 1;
  button.innerHTML = led_on ? 'OFF' : 'ON';
  status.style.backgroundColor = led_on ? '#39cc39' : '#ff5757';
}