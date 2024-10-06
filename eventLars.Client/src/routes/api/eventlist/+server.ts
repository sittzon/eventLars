import { error, json } from '@sveltejs/kit';
import { Api, type Event } from "../../../api";
import { config } from "../../../config";

export async function GET() {
    const api = new Api();
    api.baseUrl = config.apiEndpoint;

    try {
        const response = await api.event.eventList();

        if (response.status == 200) {
            return json(response.data);
        } else {
            console.log("Failed to fetch data, status:", response.status);
            return json([]);
        }
    } catch (error) {
        console.error("Error fetching event list:", error);
        return json([]);
    }
}