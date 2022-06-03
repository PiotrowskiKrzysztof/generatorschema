# generatorschema
![](frontend/src/assets/logo-dark.svg)

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [License](#license)

## General info
https://generatorschema.herokuapp.com/ <br />
A code generator based on the [Schema.org](https://schema.org/) dictionary used in the Semantic Web. <br />
Generated formats:
* JSON-LD
* RDFa
* N-Triples
* Turtle
	
## Technologies
Project is created with:
* MongoDB version: 4.5.0
* Express version: 4.17.1
* React version: 18.0.0
* Node.js version: 16.13.0
	
## Setup
Create .env file according to .env.dist 
```
$ cp .env.dist .env
```
Fill variable
```
MONGODB_URI=
```

To run this project, install it locally using npm:
```
$ npm install
$ node server.js
```

Run script to build database:
```
node controllers/ApplicationsController
```

# License
> MIT License 2022 © Krzysztof Piotrowski
