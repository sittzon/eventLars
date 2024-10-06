import { error, json } from '@sveltejs/kit';
import { Api, type Event, type EventAnswer  } from "../../../../api";
import { config } from "../../../../config";

export async function GET({params}) {
    const api = new Api();
    api.baseUrl = config.apiEndpoint;

    try {
        const response = await api.event.eventDetail(params.guid);
        
        if (response.status == 200) {
            return json(response.data);
        } else {
            console.log("Failed to fetch data, status:", response.status);
            return json({});
        }
    } catch (error) {
        console.error("Error fetching event list:", error);
        return json({});
    }
}

export async function POST({params, request}) {
    console.log("server params: ", params);

    const {allAnswers, name} = await request.json();
    console.log("server allAnswers: ", allAnswers);
    console.log("server name: ", name);


    const api = new Api();
    api.baseUrl = config.apiEndpoint;
    const response = await api.event.eventCreate2(params.guid, {answers: allAnswers, name: name});

    if (response.status == 200) {
        return new Response(200);
    } else {
        console.log("Failed to post data, status:", response.status);
        return new Response(400);
    }
}