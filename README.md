# Weather Dashboard

## Description

A weather dashboard application that allows users to search for current and future weather conditions in multiple cities. The application leverages the OpenWeather API to retrieve weather data and displays a 5-day forecast to help users plan their trips accordingly.

## Features

- Search for weather by city name
- View current weather conditions including:
  - City name, date, and weather icon
  - Temperature in Fahrenheit
  - Wind speed
  - Humidity
- View 5-day forecast showing:
  - Date
  - Weather icon
  - Temperature
  - Wind speed
  - Humidity
- Search history functionality
- Ability to delete cities from search history

## Deployment

The application is deployed here: [Weather Dashboard](https://weather-dashboard-5bfd.onrender.com)

## Technologies Used

- HTML/CSS
- JavaScript
- Node.js
- Express.js
- OpenWeather API
- TypeScript
- Day.js for date formatting
- UUID for unique ID generation

## Installation

1. Clone the repository
2. Run `npm install` to install dependencies
3. Create a .env file with your OpenWeather API key
4. Run `npm start` to start the application

## Usage

1. Enter a city name in the search field
2. View current and future weather conditions
3. Click on a city in the search history to view its weather again
4. Click the trash icon to remove a city from the search history
