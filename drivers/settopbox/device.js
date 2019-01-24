"use strict";

const Homey = require('homey');
var net = require('net');
var allPossibleInputs;
var device_data;
var device;
var settings;

module.exports = class HorizonDevice extends Homey.Device {
	
	async onSettings( oldSettingsObj, newSettingsObj, changedKeysArr ) {
	    
	    try {
	      changedKeysArr.forEach(function (key) {
	        settings[key] = newSettingsObj[key]
	      })
	    } catch (error) {
	      console.log("Error = " + error)
	    }

	    this.log ("settings update = " + JSON.stringify(settings));
	    
	}
		
	onInit() {
	
		this.log('device init');
        this.log('name:', this.getName());
        this.log('class:', this.getClass());
        
        device_data = this.getData();
        device = this;
     
     	settings = this.getSettings();
        
        this.log ("device_data = " + JSON.stringify (device_data));
        this.log ("settings = " + JSON.stringify(settings));
        
        /*
		KEY_UNKNOWN_0 	= Ef 06;	// TIMESHIFT INF
		KEY_UNKNOWN_1	= Ef 15;	// POWE
		KEY_UNKNOWN_2	= Ef 16;	// N
		*/
		allPossibleInputs = [
			{	inputName: 'E000',
		 		name: "Power toggle"
			},
			{	inputName: 'E001',
		 		name: "OK"
			},
			{	inputName: 'E002',
		 		name: "Back"
			},
			{	inputName: 'E006',
				name: "Channel up"
			},
			{	inputName: 'E007',
		 		name: "Channel down"
			},
			{	inputName: 'E009',
		 		name: "Help"
			},
			{	inputName: 'E00a',
				name: "Menu"
			},
			{	inputName: 'E00b',
				name: "TV Guide"
			},
			{	inputName: 'E00e',
		 		name: "Info"
			},
			{	inputName: 'E00f',
				name: "Text"
			},
			{	inputName: 'E011',
		 		name: "Menu1"
			},
			{	inputName: 'E015',
		 		name: "Menu2"
			},
			{	inputName: 'Ef00',
		 		name: "Menu3"
			},
			{	inputName: 'E100',
		 		name: "Up"
			},
			{	inputName: 'E101',
		 		name: "Down"
			},
			{	inputName: 'E102',
		 		name: "Left"
			},
			{	inputName: 'E103',
		 		name: "Right"
			},
			{	inputName: 'E300',
		 		name: "Number 0"
			},
			{	inputName: 'E301',
		 		name: "Number 1"
			},
			{	inputName: 'E302',
		 		name: "Number 2"
			},
			{	inputName: 'E303',
		 		name: "Number 3"
			},
			{	inputName: 'E304',
		 		name: "Number 4"
			},
			{	inputName: 'E305',
		 		name: "Number 5"
			},
			{	inputName: 'E306',
		 		name: "Number 6"
			},
			{	inputName: 'E307',
		 		name: "Number 7"
			},
			{	inputName: 'E308',
		 		name: "Number 8"
			},
			{	inputName: 'E309',
		 		name: "Number 9"
			},
			{	inputName: 'E400',
		 		name: "Pause"
			},
			{	inputName: 'E402',
		 		name: "Stop"
			},
			{	inputName: 'E403',
		 		name: "Record"
			},
			{	inputName: 'E405',
		 		name: "Forward"
			},
			{	inputName: 'E407',
		 		name: "Rewind"
			},
			{	inputName: 'Ef28',
		 		name: "ONDEMAND"
			},
			{	inputName: 'Ef29',
		 		name: "DVR"
			},
			{	inputName: 'Ef2a',
		 		name: "TV"
			}
		];
    
	    // flow action handlers
	    let powerOn = new Homey.FlowCardAction('powerOn');
			powerOn
				.register()
				.registerRunListener((args, state, callback) => {
					
					sendCommand ('E000', settings.ipaddress, function (result) {
			
						if (result == 'E000') callback (null, true); else callback (null, false);
						
					}, 'E000');
				
				});
		
		let sendKey = new Homey.FlowCardAction('sendKey');
			sendKey
				.register()
				.registerRunListener((args, state, callback) => {
					
					sendCommand (args.input.inputName, settings.ipaddress, function (result) {
			
						if (result == args.input.inputName.substring (1)) callback (null, true); else callback (null, false);	
						
					}, args.input.inputName.substring(1,5));
				
				})
				.getArgument('input')
				.registerAutocompleteListener(( query, args ) => {
			      return Promise.resolve(
			        allPossibleInputs
			      );
			    });
	
		
		let setChannel = new Homey.FlowCardAction('setChannel');
			setChannel
				.register()
				.registerRunListener((args, state, callback) => {
					
					if (channel.length == 3) {
				
						console.log('send key: ' + channel[0]);
						
						sendCommand ('E30' + channel[0], settings.ipaddress, function (result) {
							
							console.log('send key: ' + channel[1]);
						
							sendCommand ('E30' + channel[1], settings.ipaddress, function (result) {
								
								console.log('send key: ' + channel[2]);
						
								sendCommand ('E30' + channel[2], settings.ipaddress, function (result) {
									
									callback (null, true);
														
								});
								
							});
							
						});
						
					}
					
					if (channel.length == 2) {
						
						console.log('send key: ' + channel[0]);
						
						sendCommand ('E30' + channel[0], settings.ipaddress, function (result) {
							
							console.log('send key: ' + channel[1]);
						
							sendCommand ('E30' + channel[1], settings.ipaddress, function (result) {
								
								callback (null, true);
								
							});
							
						});
						
					}
					
					if (channel.length == 1) {
						
						console.log('send key: ' + channel[0]);
						
						sendCommand ('E30' + channel[0], settings.ipaddress, function (result) {
							
							callback (null, true);
							
						});
						
					}
				
				});
	
		/*
		Homey.manager('flow').on('action.sendKey.input.autocomplete', function (callback, value) {
			var inputSearchString = value.query;
			var items = searchForInputsByValue( inputSearchString );
			callback(null, items);
		});
		*/
		
		function sendCommand (cmd, hostIP, callback, substring) {
		
			console.log('======================================================');
			console.log ("Horizon app - sending " + cmd + " to " + hostIP);
			
			//open on port 5900
			var client = new net.Socket();
			client.connect(5900, hostIP);
			
			client.on('error', function(err){
			
			    console.log("Error: "+err.message);
			    callback (err.message, false);
			
			});
			
			client.on('close', function() {
				
				console.log('Connection closed');
				
				client.destroy();
				
				callback (null, false);
				
			});
		
			client.on('data', function(data) {
				
				var datastring = data.toString();
				
				
				var buffer = data.toJSON(data);
				
				console.log ('buffer = ' + JSON.stringify(buffer.data));
		
				//readVersionMsg
				if (datastring.substring(0,3) == 'RFB') {
					
					console.log('Received version message, returning it.');
					client.write (datastring);
					
				//OK
				} else if (datastring == "\u0001\u0001") {
					
					console.log('received OK message, returning it.');
					// Send Authorisation type (none)
					client.write (Hex2Bin('01'));
				
				//OK to authorisation type
				} else if (datastring == "\u0000\u0000\u0000\u0000") {
					
					console.log('received AUTH OK message');
				
				} else if (datastring == "\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000\u0000") {
					//client.write
					
					console.log('Received init data');	
					console.log ('sending: ' + "040100000000" + cmd);
					console.log ('sending: ' + Hex2Bin("040100000000" + cmd));
					client.write(Hex2Bin("040100000000" + cmd)); // Turn key on
				    setTimeout(function() {
					    console.log ('turn key off');
					    client.write(Hex2Bin("040000000000" + cmd));
					    
					    client.destroy();
					}, 400); // Turn key off
					
				} else {
					
					console.log ('unrecognized datastring=' + JSON.stringify(datastring));
					
				}
				
			});
			
		}
		
		function searchForInputsByValue ( value ) {
			var possibleInputs = allPossibleInputs;
			var tempItems = [];
			for (var i = 0; i < possibleInputs.length; i++) {
				var tempInput = possibleInputs[i];
				if ( tempInput.name.toLowerCase().indexOf(value.toLowerCase()) >= 0 ) {
					tempItems.push({ icon: "", name: tempInput.name, inputName: tempInput.inputName });
				}
			}
			return tempItems;
		}
		
		function Hex2Bin (s) {
		
			return new Buffer(s, "hex");
		
		}
		
	}
	
}