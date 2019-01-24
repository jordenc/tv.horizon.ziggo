"use strict";

const Homey = require('homey');
var tempIP = '';

/*
module.exports.settings = function( device_data, newSettingsObj, oldSettingsObj, changedKeysArr, callback ) {

    console.log ('Changed settings: ' + JSON.stringify(device_data) + ' / ' + JSON.stringify(newSettingsObj) + ' / old = ' + JSON.stringify(oldSettingsObj));
    
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
	    
	    console.log('add device: ' + JSON.stringify(device));
	    
	    devices[device.id] = Object.assign({}, device);   
	    
	    module.exports.getSettings(device, function(err, settings){
		    devices[device.id].settings = settings;
		});
		
	});
	
	console.log("Horizon app - init done");
	
	callback (null, true);
};

module.exports.deleted = function( device_data ) {
    
    console.log('deleted: ' + JSON.stringify(device_data));
    
    devices[device_data.id] = [];
	
};
*/


class HorizonDriver extends Homey.Driver {
	// socket is a direct channel to the front-end

	// this method is run when Homey.emit('list_devices') is run on the front-end
	// which happens when you use the template `list_devices`
	onPair( socket ) {
		
		socket.on('list_devices', function (data, callback) {

			console.log("Horizon app - list_devices tempIP is " + tempIP);
			
			var add_devices = [];
			
			add_devices.push(
				{
					name	: 'Horizon ' + tempIP,
					data: {
						id	:	tempIP
					},
					settings: {
						"ipaddress"		:	tempIP
					}
				}
			);
	
			callback (null, add_devices);
		
		});
		
		socket.on('get_devices', function (data, callback) {
		
			// Set passed pair settings in variables
			tempIP = data.ipaddress;
			console.log ( "Horizon app - got get_devices from front-end, tempIP =" + tempIP );
	
			// assume IP is OK and continue
			socket.emit ('continue', null);
		
		});
		
	}

}

module.exports = HorizonDriver;