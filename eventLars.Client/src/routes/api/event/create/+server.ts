import { error, json } from '@sveltejs/kit';
import { Api, type Event, type EventAnswer  } from "../../../../api";
import { config } from "../../../../config";


export async function POST({request}) {
    const data = await request.json();
    console.log("event: ", data);

    const api = new Api();
    api.baseUrl = config.apiEndpoint;
    const response = await api.event.eventCreate(data);

    if (response.status == 201) {
        const location = response.headers.get("location");
        const guid = location?.split("id=").pop();
        console.log("created guid: ", guid);
        return new Response(JSON.stringify({ guid: guid }), 
        { status: 201, headers: 
            { "Content-Type": "application/json" } 
        });
    } else {
        console.log("Failed to post data, status:", response.status);
        return new Response(400);
    }
}