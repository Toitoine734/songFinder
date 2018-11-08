# SongFinder  
    
This project makes it possible to carry out a simultaneous search on the most known platforms of music.

## Getting Started  
  
These instructions will get you a copy of the project up and running on your local machine for development. See deployment for notes on how to deploy the project on a production system.
  
### Prerequisites  
  
  Requirement:
  * nodeJS
  * docker
  
  Configuration:  
  
  Create a config.ts file in src/app like the file src/app/config.ts.example to provide the api keys (Spotify and Youtube)
  
### Installing  
  
A step by step series of examples that tell you how to get a development env running  
  
Go to the project.
  
```  
cd songFinder/
```  
  
Prepare the project
  
```  
npm install  
```  

Launch the server
  
```  
npm start
```  
  
  
## Deployment  

Go to the project.
  
```  
cd songFinder/
```  
  
Prepare the project
  
```  
npm install  
```  

Launch the server
  
```  
npm run build
```  

Launch the project in NginX

```
docker run -dit --name songFinder -v ./www:/usr/share/nginx/html -p 9991:80 nginx
```
  
## Built With  
  
* [NodeJS](https://nodejs.org/) - Dependency Management.
* [Ionic](https://ionicframework.com/) - The nodeJS framework used.

## Versioning  
  
We use [Git](https://git-scm.com/) for versioning.
  
## Authors  
  
* **Antoine BLANCHARD**
  
## License  
  
This project is licensed under the MIT License.
