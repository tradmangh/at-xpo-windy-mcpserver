import { handleCallTool } from './tools.js';

const POINT_FORECAST_KEY = "i3n3BoHw72IdtwwvVKDKTIAxN1CSsGLx";
const WEBCAMS_KEY = "HzpVD8TaZ3FsCPdFfrzZsGIhRVYd2H9H";

async function verify() {
    console.log("Verifying Point Forecast for Theologos, Rhodes...");
    try {
        const forecast = await handleCallTool("get_point_forecast", {
            lat: 36.372,
            lon: 28.035,
            model: "gfs",
            parameters: ["temp", "wind"]
        }, { pointForecast: POINT_FORECAST_KEY });
        console.log("Point Forecast Result:", JSON.stringify(forecast, null, 2).substring(0, 500) + "...");
    } catch (e: any) {
        console.error("Point Forecast Failed:", e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
    }

    console.log("\nVerifying Webcams for Theologos, Rhodes...");
    try {
        const webcams = await handleCallTool("get_webcams", {
            lat: 36.372,
            lon: 28.035,
            radius: 50
        }, { webcams: WEBCAMS_KEY });
        console.log("Webcams Result:", JSON.stringify(webcams, null, 2).substring(0, 500) + "...");
    } catch (e: any) {
        console.error("Webcams Failed:", e.response ? JSON.stringify(e.response.data, null, 2) : e.message);
    }
}

verify();
