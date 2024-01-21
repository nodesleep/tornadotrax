# TornadoTrax

TornadoTrax is a web application that serves as a visual archive and path tracker for every documented tornado in the United States from 1950 to 2022. This project provides users with an interactive map displaying tornado tracks, along with essential information such as tornado ratings, date and time, fatalities, injuries, distance, and maximum width.

A live version can be viewed [here](https://tornadovisualizer.vercel.app/)

![image](https://github.com/themattbook/tornadotrax/blob/main/public/product-screen.png?raw=true)

## Features

-   **Interactive Map:** Explore tornado tracks on an interactive map powered by Leaflet.
-   **Filter by State and Year:** Filter tornado events based on the selected state and year to focus on specific regions and timeframes.
-   **Legend:** A legend displays the Enhanced Fujita (EF) ratings, allowing users to understand the severity of tornadoes based on the color-coded legend.

## Technologies Used

-   **Vue.js:** The frontend is built using Vue.js, a progressive JavaScript framework.
-   **Leaflet:** The Leaflet library is used for creating interactive maps.
-   **JSON Data:** Tornado data is sourced from a JSON file included in the project.
-   **Responsive Design:** The application is designed to be responsive, providing a tailored experience for both desktop and mobile users.

## Project Structure

The project consists of two main components:

1. **App.vue:** The main Vue.js component that handles the user interface, state management, and data filtering.
2. **TornadoMapComponent.vue:** A reusable Vue.js component responsible for rendering the Leaflet map and displaying tornado tracks.

## Getting Started

To run TornadoTrax locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/TornadoTrax.git
    ```

2. Navigate to the project directory:

    ```bash
    cd TornadoTrax
    ```

3. Install dependencies:

    ```bash
    npm install
    ```

4. Run the application:

    ```bash
    npm run serve
    ```

5. Open your browser and go to [http://localhost:8080](http://localhost:8080) to view TornadoTrax.

## Contribution Guidelines

Contributions to TornadoTrax are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

---

**Note:** TornadoTrax is designed for desktop use, and a message is displayed for mobile users to inform them about the desktop-centric nature of the application.

Happy exploring tornado tracks with TornadoTrax! 🌪️
