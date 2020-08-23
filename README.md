# Simple Ecommerce Backend

A simple CRUD project using Node, Express, Typescript, TypeORM, PostgreSQL etc. It creates customers, products, orders and lists the orders.

### Prerequisites

Node.js, PostgreSQL and a package manager like npm or yarn.

### Installing

Run `npm install` or `yarn` to install all the dependencies.
Run `npm run dev` or `yarn dev:server` to run the server.

## Getting Started

The following endpoints can be tested with this server:

To create a customer (the body receives name (string) and email (string)):
    POST http://localhost:3333/customers

To create a product (the body receives name (string), price (number) and quantity (number)):
    POST http://localhost:3333/products

To create an order (the body receives customer_id (string) and products - an array containing objects with the fields id (string) and quantity (number) - ):
    POST http://localhost:3333/orders

## Running the tests

Run `npm test` or `yarn test` to run all the unit tests.
