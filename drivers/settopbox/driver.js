"use strict";

const Homey = require('homey');
var tempIP = '';

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