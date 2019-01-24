# Ziggo Horizon settopbox app for Athom Homey

Control your Ziggo Horizon settopbox using the Homey by Athom B.V.

**Want to show your appreciation for this app? A donation is possible via http://www.d2c.nl **

You first need to have the IP-address of your Horizon box. Make sure this is a fixed IP address, or otherwise the device cannot be controlled. You can only control it if it is in the same network as Homey.

Enables the following actions to use in your flows:
- Toggle power
- Send key

Use at your own risk, I accept no responsibility for any damages caused by using this script.

TIP: If your Horizon IP does not work, add one number to it. For example, if your Horizon shows that it is available at 192.168.1.7 and that doesn't work, try 192.168.1.8

# Changelog
** Version 0.2.0**
- Support for Homey 2.0

**Version 0.1.4**
- Added a max number of 999 to channels

**Version 0.1.3:**
- Fixed a bug that caused the app to crash after first pair
- New "Set channel" card which makes it easier to set a channel number above 9

**Version 0.1.2:**
- Fixed Power toggle action card

**Version 0.1.1:**
- Fixed: Now correctly closes connection

**Version 0.1.0:**
- First release
