# generatorschema
https://generatorschema.herokuapp.com/

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Env](#env)
* [Setup](#setup)

## General info
A code generator based on the [Schema.org](https://schema.org/) dictionary used in the Semantic Web. <br />
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

## Env
Create .env file according to .env.dist 

```
cp .env.dist .env
```

Fill variables

```
MONGODB_URI=
```
	
## Setup
To run this project, install it locally using npm:

```
$ npm install
$ node server.js
```
