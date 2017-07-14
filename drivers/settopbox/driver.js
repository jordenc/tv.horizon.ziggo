"use strict";

var net = require('net');
var tempIP = '';
var devices = {};

module.exports.settings = function( device_data, newSettingsObj, oldSettingsObj, changedKeysArr, callback ) {

    Homey.log ('Changed settings: ' + JSON.stringify(device_data) + ' / ' + JSON.stringify(newSettingsObj) + ' / old = ' + JSON.stringify(oldSettingsObj));
    
    try {
      changedKeysArr.forEach(function (key) {
        devices[device_data.id].settings[key] = newSettingsObj[key]
      })
      callback(null, true)
    } catch (error) {
      callback(error)
    }

};

module.exports.init = function(devices_data, callback) {
    
    devices_data.forEach(function initdevice(device) {
	    
	    Homey.log('add device: ' + JSON.stringify(device));
	    
	    devices[device.id] = device;    
	    
	    module.exports.getSettings(device, function(err, settings){
		    devices[device.id].settings = settings;
		});
		
	});
	
	Homey.log("Horizon app - init done");
	
	callback (null, true);
};

module.exports.deleted = function( device_data ) {
    
    Homey.log('deleted: ' + JSON.stringify(device_data));
    
    devices[device_data.id] = [];
	
};


/*
KEY_UNKNOWN_0 	= Ef 06;	// TIMESHIFT INF
KEY_UNKNOWN_1	= Ef 15;	// POWE
KEY_UNKNOWN_2	= Ef 16;	// N
*/

var allPossibleInputs = [
		{	inputName: 'E000',
	 		friendlyName: "Power toggle"
		},
		{	inputName: 'E001',
	 		friendlyName: "OK"
		},
		{	inputName: 'E002',
	 		friendlyName: "Back"
		},
		{	inputName: 'E006',
			friendlyName: "Channel up"
		},
		{	inputName: 'E007',
	 		friendlyName: "Channel down"
		},
		{	inputName: 'E009',
	 		friendlyName: "Help"
		},
		{	inputName: 'E00a',
			friendlyName: "Menu"
		},
		{	inputName: 'E00b',
			friendlyName: "TV Guide"
		},
		{	inputName: 'E00e',
	 		friendlyName: "Info"
		},
		{	inputName: 'E00f',
			friendlyName: "Text"
		},
		{	inputName: 'E011',
	 		friendlyName: "Menu1"
		},
		{	inputName: 'E015',
	 		friendlyName: "Menu2"
		},
		{	inputName: 'Ef00',
	 		friendlyName: "Menu3"
		},
		{	inputName: 'E100',
	 		friendlyName: "Up"
		},
		{	inputName: 'E101',
	 		friendlyName: "Down"
		},
		{	inputName: 'E102',
	 		friendlyName: "Left"
		},
		{	inputName: 'E103',
	 		friendlyName: "Right"
		},
		{	inputName: 'E300',
	 		friendlyName: "Number 0"
		},
		{	inputName: 'E301',
	 		friendlyName: "Number 1"
		},
		{	inputName: 'E302',
	 		friendlyName: "Number 2"
		},
		{	inputName: 'E303',
	 		friendlyName: "Number 3"
		},
		{	inputName: 'E304',
	 		friendlyName: "Number 4"
		},
		{	inputName: 'E305',
	 		friendlyName: "Number 5"
		},
		{	inputName: 'E306',
	 		friendlyName: "Number 6"
		},
		{	inputName: 'E307',
	 		friendlyName: "Number 7"
		},
		{	inputName: 'E308',
	 		friendlyName: "Number 8"
		},
		{	inputName: 'E309',
	 		friendlyName: "Number 9"
		},
		{	inputName: 'E400',
	 		friendlyName: "Pause"
		},
		{	inputName: 'E402',
	 		friendlyName: "Stop"
		},
		{	inputName: 'E403',
	 		friendlyName: "Record"
		},
		{	inputName: 'E405',
	 		friendlyName: "Forward"
		},
		{	inputName: 'E407',
	 		friendlyName: "Rewind"
		},
		{	inputName: 'Ef28',
	 		friendlyName: "ONDEMAND"
		},
		{	inputName: 'Ef29',
	 		friendlyName: "DVR"
		},
		{	inputName: 'Ef2a',
	 		friendlyName: "TV"
		}
];

module.exports.pair = function (socket) {
	// socket is a direct channel to the front-end

	// this method is run when Homey.emit('list_devices') is run on the front-end
	// which happens when you use the template `list_devices`
	socket.on('list_devices', function (data, callback) {

		Homey.log("Horizon app - list_devices tempIP is " + tempIP);
		
		var devices = [{
			name				: tempIP,
			data: {
				id				: tempIP,
			},
			settings: {
				"ipaddress" 	: tempIP
			}
		}];

		callback (null, devices);

	});

	// this is called when the user presses save settings button in start.html
	socket.on('get_devices', function (data, callback) {

		// Set passed pair settings in variables
		tempIP = data.ipaddress;
		Homey.log ( "Horizon app - got get_devices from front-end, tempIP =" + tempIP );

		// assume IP is OK and continue
		socket.emit ('continue', null);

	});

	socket.on('disconnect', function(){
		Homey.log("Horizon app - User aborted pairing, or pairing is finished");
	})
}

Homey.on('unload', function(){
	//client.destroy();
});

// flow action handlers
Homey.manager('flow').on('action.powerOn', function (callback, args) {
	sendCommand ('!1PWR01', devices[args.device.id].settings.ipaddress, function (result) {
	
		if (result == '1PWR01') callback (null, true); else callback (null, false);
		
	}, '1PWR');
});

Homey.manager('flow').on('action.sendKey', function (callback, args) {
	sendCommand (args.input.inputName, devices[args.device.id].settings.ipaddress, function (result) {
	
		if (result == args.input.inputName.substring (1)) callback (null, true); else callback (null, false);	
		
	}, args.input.inputName.substring(1,5));
});

Homey.manager('flow').on('action.sendKey.input.autocomplete', function (callback, value) {
	var inputSearchString = value.query;
	var items = searchForInputsByValue( inputSearchString );
	callback(null, items);
});

function sendCommand (cmd, hostIP, callback, substring) {

	Homey.log('======================================================');
	Homey.log ("Horizon app - sending " + cmd + " to " + hostIP);
	
	//open on port 5900
	var client = new net.Socket();
	client.connect(5900, hostIP);
	
	client.on('error', function(err){
	
	    Homey.log("Error: "+err.message);
	    callback (err.message, false);
	
	});
	
	client.on('close', function() {
		
		Homey.log('Connection closed');
		
		callback (null, false);
		
	});

	client.on('data', function(data) {
		
		var datastring = data.toString();
		
		
		var buffer = data.toJSON(data);
		
		Homey.log ('buffer = ' + JSON.stringify(buffer.data));

		//readVersionMsg
		if (datastring.substring(0,3) == 'RFB') {
			
			Homey.log('Received version message, returning it.');
			client.write (datastring);
			
		//OK
		} else if (datastring == "\u0001\u0001") {
			
			Homey.log('received OK message, returning it.');
			// Send Authorisation type (none)
			client.write (Hex2Bin('01'));
		
		//OK to authorisation type
		} else if (datastring == "\u0000\u0000\u0000\u0000") {
			
			Homey.log('received AUTH OK message');
		
		} else if (datastring == "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000") {
			//client.write
			
			Homey.log('Received init data');	
			Homey.log ('sending: ' + "040100000000" + cmd);
			Homey.log ('sending: ' + Hex2Bin("040100000000" + cmd));
			client.write(Hex2Bin("040100000000" + cmd)); // Turn key on
		    setTimeout(function() {
			    Homey.log ('turn key off');
			    client.write(Hex2Bin("040000000000" + cmd));
			    
			    client.destroy();
			}, 400); // Turn key off
			
		} else {
			
			Homey.log ('unrecognized datastring=' + JSON.stringify(datastring));
			
		}
		
	});
	
}

function searchForInputsByValue ( value ) {
	var possibleInputs = allPossibleInputs;
	var tempItems = [];
	for (var i = 0; i < possibleInputs.length; i++) {
		var tempInput = possibleInputs[i];
		if ( tempInput.friendlyName.toLowerCase().indexOf(value.toLowerCase()) >= 0 ) {
			tempItems.push({ icon: "", name: tempInput.friendlyName, inputName: tempInput.inputName });
		}
	}
	return tempItems;
}

function Hex2Bin (s) {

	return new Buffer(s, "hex");

}