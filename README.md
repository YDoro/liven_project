{:toc}
# Liven Project

This project was made using Typescript and MongoDb with Test Driven Development, and Clean Architecture.
It was a challenge from [Liven](https://liven.tech/pt) to join their development team.

For more details see the [documentation](https://studio-ws.apicur.io/sharing/88289fe3-5afa-445a-9694-a120fcdd48af).

## whys 

### MongoDb

Mongodb is the most popular non relational database with flexible document schemas, powerful querying, faster than SQL databases and also is super friendly.

I aways try to use MongoDb in my project because I can change the database structure every time I need without think about db structures and other "SQL problems".

### Clean architecture

created by [Uncle Bob](https://github.com/unclebob), it brings some facilities on **code maintenance and testing** and helps to respect [SOLID](https://en.wikipedia.org/wiki/SOLID) principles
by using clean architecture we should segregate the application in a few layers on this project i used a folder structure to help understand some of this layers.
basically on this project 

- domain contains all models and usecases interfaces

- data layer contains generic implementations of usecases interfaces

- infra layer contains  specific implementations that can be used by data layer (repositories and other dependencies)

- presentation contains the "front line" of the application (Controllers, Middlewares, custom errors)

- validation is an "additional layer" to contain controller validations (isn't a layer, I've just moved it's folder out of presentation because validations can be made in multiple moments)

- main layer is the application core, here we'll create our factories , adapters, middlewares* and routes

  *non domain middlewares like CORS, body-parser, and others. For domain middlewares like authentication we use presentation folder.

### Conventional Commits

sometime ago i was searching about git flow and other good practices for development and i found [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) after that i notice that too many open source projects use this pattern and realized that this commit pattern is a powerful tool on collaborative projects



## The challenge

This project supposed to register users and :

- The users can have many addresses;
- Only the users can view their data;
- The users should be Authenticated to use the routes;
- The users should be able to Add an address;
- The users should be able to Search addresses (with querystring and/or params);
- The users should be able to Update an address;
- The users should be able to Delete an address;
- The users should be able to Update their data;
- The users should be able to Delete their account;

