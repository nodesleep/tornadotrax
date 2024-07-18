# TornadoTrax

TornadoTrax is a web application that serves as a visual archive and path tracker for every documented tornado in the United States from 1950 to 2022. This project provides users with an interactive map displaying tornado tracks, along with essential information such as tornado ratings, date and time, fatalities, injuries, distance, and maximum width.

A live version can be viewed [here](https://tornadotrax.com)

![image](https://raw.githubusercontent.com/nodesleep/tornadotrax/main/public/product_screen.png)

## Features

-   **Interactive Map:** Explore tornado tracks on an interactive map powered by Leaflet.
-   **Filter by State:** Filter tornado events based on the selected state(s).
-   **Filter by Date:** Filter tornado events based on the selected date range.
-   **Filter by Rating:** Filter tornado events based on the rating(s) selected.
-   **Legend:** A legend displays the Enhanced Fujita (EF) ratings, allowing users to understand the severity of tornadoes based on the color-coded legend.
-   **Settings:** Now contains settings to change the overall user experience of the app.

## Technologies Used

-   **Vue.js:** The frontend is built using Vue.js, a progressive JavaScript framework.
-   **Leaflet:** The Leaflet library is used for creating interactive maps.
-   **JSON Data:** Tornado data is sourced from a Nestjs API, but a JSON file included in the project. The data came directly from the Storm Prediction Center, found [here](https://www.spc.noaa.gov/gis/svrgis/)

## Project Structure

The project consists of two main components:

1. **Home.vue:** The main Vue.js view that handles the user interface, state management, and data filtering.
2. **TornadoMapComponent.vue:** A reusable Vue.js component responsible for rendering the Leaflet map and displaying tornado tracks.

## Future Plans

The idea behind this application is to find meaningful ways of displaying data in an interactive way. Being able to see tornado paths on a map of a state in a given year is pretty neat, but there's a lot of extrapolation that could make the app more robust.

1. In a future release, TornadoTrax will include some form of Time Series Analysis, which will implement charts to display the frequency of tornadoes over time, average magnitudes per year, and changes in injuries/fatalities or economic losses. These are just some rough ideas. The popup that appears when clicking on a tornado path provides a cursory view of this information, but different structuring methods combined with user options to filter and sort the data will make TornadoTrax a powerful tool for hobbyists and researchers alike.
2. I'm still considering implementing Detail Cards to replace or expand upon the information popup a user sees when clicking on a tornado path. I'd like to include some additional information like notable events or communities affected, etc.. Some other ideas spawn from this one, such as organizing notable weather events into clusters and incorporating that into the map/chart/data presentation.
3. As more ideas emerge, I'll place them here. Feel free to contact me if there's a specific feature you'd like to see. Better yet, fork!
4. An API is being actively developed to improve the capabilities and filtering of data without putting all of the burden on the client. It can be viewed [here](https://github.com/themattbook/tornadotrax-api). A production release is currently live.

## Getting Started

To run TornadoTrax locally, follow these steps:

1. Clone the repository:

    ```bash
    git clone https://github.com/nodesleep/TornadoTrax.git
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

5. Open your browser and go to [http://localhost:5173](http://localhost:5173) to view TornadoTrax.

## Contribution Guidelines

Contributions to TornadoTrax are welcome! If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request.

## License

This project is licensed under the GNU General Public License v3.0 - see the [LICENSE](LICENSE) file for details.

---

**Note:** TornadoTrax is designed for desktop use, and a message is displayed for mobile users to inform them about the desktop-centric nature of the application.

Happy exploring tornado tracks with TornadoTrax! 🌪️
