# buyify

Simple Fake Ecommerce Site for Tracking Demonstration

Angular & Materialize CSS & MongoDB & Local Storage

This is a 2 page ecommerce site that is used to demonstrate tracking using the wokesharks tracking library.

It has a list of products being read from product.json, inserted into mongo and then we are hitting the API within the productServices.js file. We are then populating the UI with the content retreived using productServices.js.

The wokeShark.js tracking script is independent and simply implemented on the Buyify.com app to send events to the wokeShark analytics endpoints.

There are additional comments in the wokeShark.js file that describes this.

Starting the App:

1. Install MongoDB
2. Start MongoDB
3. CD into root folder and run NPM INSTALL
4. nodemon start (feel free to change the npm start script)

