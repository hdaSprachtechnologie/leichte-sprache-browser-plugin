# Development

----
## 1) Prepare MongoDB
* cd src\dbimport
* npm init -y
* npm install mongodb


### what
the app fills the mongodb leichtesprache/lexicon with the entries of lexicon.js

### install
* install node
* [install mongodb](https://docs.mongodb.com/manual/installation/)
* start the mongodb service
  
    ```sudo systemctl start mongod```
* [install Robo 3T](https://robomongo.org/download) and create the database leichtesprache with 
  collection lexicon (so far not authentication), screenshots on how to do this can be found in 
  robo3t_screenshots/

### run
node index.js

---
## 2) Start the backend
see first paragraphs of backend/README.md

---
##3) Add the Addon to Firefox
see the link in webextension/README.md