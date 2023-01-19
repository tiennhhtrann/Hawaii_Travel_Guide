import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify
from flask_cors import CORS


#################################################
# Database Setup
#################################################
engine = create_engine("sqlite:///weather.sqlite")

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save reference to the table
WeatherReading = Base.classes.weather

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
CORS(app)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    return (
        f"Available Routes:<br/>"
        f"/api/v1.0/weather-hawaii"
    )

@app.route("/api/v1.0/weather-hawaii")
def weather():
    session = Session(engine)

    """Return a list of passenger data including the name, age, and sex of each passenger"""
    # Query all passengers
    results = session.query(WeatherReading).all()

    session.close()

    # Create a dictionary from the row data and append to a list of all_passengers
    all_weather = []
    for weather in results:
        weather_dict = {}
        weather_dict["city_name"] = weather.city_name
        weather_dict["main_weather"] = weather.main_weather
        weather_dict["temperature"] = weather.temperature
        weather_dict["humidity"] = weather.humidity
        weather_dict["cloudiness"] = weather.cloudiness
        weather_dict["wind_speed"] = weather.wind_speed
        all_weather.append(weather_dict)
        
    return jsonify(all_weather)


if __name__ == '__main__':
    app.run(debug=True)