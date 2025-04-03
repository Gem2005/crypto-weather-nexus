# Crypto Weather Nexus

A modern, multi-page dashboard combining weather data, cryptocurrency information, and real-time notifications via WebSocket.

## Overview

Crypto Weather Nexus analyzes potential relationships between weather events and cryptocurrency price movements. The application aggregates data from multiple sources, providing users with insights on how environmental factors might influence digital asset markets. It features a responsive dashboard with weather data for multiple cities, live cryptocurrency information, and real-time notifications.

## Features

- Real-time cryptocurrency price tracking with WebSocket notifications
- Global weather pattern monitoring for multiple cities
- Interactive data visualization and analysis tools
- Historical correlation analysis for both weather and crypto data
- Multi-page architecture with detailed views for cities and cryptocurrencies
- User favorites system for cities and cryptocurrencies
- Real-time notifications for significant price shifts and weather alerts

## Tech Stack

- **Framework**: Next.js (v13+) with file-based routing
- **Frontend**: React (hooks for state and lifecycle)
- **State Management**: Redux with async middleware (Redux Thunk or Saga)
- **Styling**: Tailwind CSS for responsive design
- **Data Fetching**: REST APIs and WebSocket connections

## API Integration

This project uses:
- **Weather Data**: OpenWeatherMap API
- **Cryptocurrency Data**: CoinGecko or CoinCap API
- **News Headlines**: NewsData.io
- **Real-Time Updates**: CoinCap WebSocket for live price updates

## Multi-Page Architecture

- **Dashboard Page**:
  - Weather section: Temperature, humidity, and conditions for predefined cities
  - Cryptocurrency section: Live price, 24h change, and market cap for major cryptocurrencies
  - News section: Top five crypto-related headlines

- **Detail Pages**:
  - City details with weather history and visualizations
  - Cryptocurrency details with historical pricing and extended metrics

## Installation

```bash
# Clone the repository
git clone https://github.com/Gem2005/crypto-weather-nexus.git

# Navigate to the project directory
cd crypto-weather-nexus

# Install dependencies
npm install
```

## Usage

```bash
# Start the application
npm start
```

The application will be available at `http://localhost:3000` by default.

## Configuration

Create a `.env` file in the root directory with the following variables:

```
NEXT_PUBLIC_WEATHER_API_KEY=your_weather_api_key
NEXT_PUBLIC_CRYPTO_API_KEY=your_crypto_api_key
NEXT_PUBLIC_NEWS_API_KEY=your_news_api_key
```

## Deployment

The application is deployed on Vercel/Netlify with environment variables securely managed through the platform.

## Design Decisions

- **Real-time Updates**: WebSocket connection for live cryptocurrency price updates and simulated weather alerts
- **State Management**: Redux store for user preferences (favorite cities/cryptos) and all fetched data
- **Error Handling**: Graceful handling of partial API failures with fallback UI
- **Responsive Design**: Tailwind CSS for consistent layout across all device sizes
- **Data Refresh**: Periodic data synchronization (every 60s) for up-to-date information

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Cryptocurrency data provided by [CoinGecko](https://www.coingecko.com) / [CoinCap](https://coincap.io/)
- Weather data provided by [OpenWeatherMap](https://openweathermap.org)
- News headlines provided by [NewsData.io](https://newsdata.io/)
