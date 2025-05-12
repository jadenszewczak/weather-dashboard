import { Router, type Request, type Response } from "express";
const router = Router();

import HistoryService from "../../service/historyService.js";
import WeatherService from "../../service/weatherService.js";

// POST Request with city name to retrieve weather data
router.post("/", async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;

    if (!cityName) {
      return res.status(400).json({ error: "City name is required" });
    }

    // Save city to search history
    await HistoryService.addCity(cityName);

    // Get weather data for the city
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    return res.json(weatherData);
  } catch (error) {
    console.error("Error in POST /api/weather:", error);
    return res.status(500).json({ error: "Failed to fetch weather data" });
  }
});

// GET search history
router.get("/history", async (_, res: Response) => {
  try {
    const cities = await HistoryService.getCities();
    return res.json(cities);
  } catch (error) {
    console.error("Error in GET /api/weather/history:", error);
    return res.status(500).json({ error: "Failed to fetch search history" });
  }
});

// BONUS: DELETE city from search history
router.delete("/history/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "City ID is required" });
    }

    await HistoryService.removeCity(id);
    return res.status(204).end();
  } catch (error) {
    console.error("Error in DELETE /api/weather/history/:id:", error);
    return res
      .status(500)
      .json({ error: "Failed to delete city from search history" });
  }
});

export default router;
