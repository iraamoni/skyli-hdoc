import React from 'react';

const Locations = {
    london: {
        position: {
            latitude: 51.509865,
            longitude: -0.118092
        },
        name: "London, United Kingdom",
    },
    newYork: {
        position: {
            latitude: 40.730610,
            longitude: -73.935242
        },
        name: "New York, United States of America",
    },
    berlin: {
        position: {
            latitude: 52.520008,
            longitude: 13.404954
        },
        name: "Berlin, Germany",
    },
};

const kelvin = 273; 
const key = '70e35fea7adc9d727c2aba9846756853';

class App extends React.Component {
    state = {
        error: null,
        geolocationError: false,
        loading: false,
        weather: {
            unit: "celsius",
            iconId: 'unknown',
            temp: '-',
            tempFahrenheit: '-',
            description: '-',
            city: '-',
            country: null,
        },
    };

    setPosition = (position) => {
        this.getWeather(position.coords);
    }


    getCurrentLocation () {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(this.setPosition, () => {
                this.setState({ geolocationError: true });
            });
        } else {
            this.setState({ geolocationError: true });
        }
    }

    componentDidMount () {
        this.getCurrentLocation();
    }

    celsiusToFahrenheit() {
        const weather = {...this.state.weather};
        if (weather.unit == "celsius") {
            weather.unit = "fahrenheit";
        } else {
            weather.unit = "celsius";
        }
        this.setState({weather})
    }

    getWeather(position) {
        let api = `https://api.openweathermap.org/data/2.5/weather?lat=${position.latitude}&lon=${position.longitude}&appid=${key}`;
        
        this.setState({ loading: true });
        fetch(api)
            .then(function(response){
                let data = response.json();
                return data;
            })
            .then((data) => {
                const weather = {...this.state.weather};
    
                weather.temp = Math.floor(data.main.temp - kelvin);
                weather.tempFahrenheit = (weather.temp * 9/5) + 32;
                weather.description = data.weather[0].description;
                weather.iconId = data.weather[0].icon;
                weather.city = data.name;
                weather.country = data.sys.country;

                this.setState({ loading: false, weather });
            });
    }
    
    render () {

        return (
        <>
            <div className = 'app-title'><p>Skyli {this.state.loading && "loading..."}</p></div>
            {this.state.geolocationError && (
                <div className = 'notification'>
                    <p>Browser doesn't support geolocation</p>
                </div>
            )}
            <div className = 'weather-container'>
                <div className = 'weather-icon'>
                    <img src = {`${process.env.PUBLIC_URL}/icons/${this.state.weather.iconId}.png`}/>
                </div>
                <div className = 'temperature-value' onClick = {() => this.celsiusToFahrenheit()}>
                    <p>{this.state.weather.unit == "celsius" ? this.state.weather.temp : this.state.weather.tempFahrenheit} °<span>{this.state.weather.unit == "celsius" ? "C" : "F"}</span> </p>
                </div>
                <div className = 'temperature-description'>
                    <p> {this.state.weather.description} </p>
                </div>
                <div className = 'location'> 
                    <p> {this.state.weather.city}{this.state.weather.country && ", " + this.state.weather.country} </p> 
                </div>
                <div>
                    <ul className = "city-list">
                        {Object.values(Locations).map(city => {
                            return (
                                <li onClick={() => this.getWeather(city.position)}>
                                    { city.name }
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </>
        );
    }
}

export default App;
