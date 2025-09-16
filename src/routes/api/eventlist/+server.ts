import { error, json } from '@sveltejs/kit';
import { type Event } from "../../../api";
import { env } from '$env/dynamic/private';
import fs from 'fs/promises';

const dataRoot = env.EVENTS_ROOT || '/events';

// Read all event files and return contents
export async function GET() {
    try {
        const events: Event[] = [];
        const eventFiles = (await fs.readdir(dataRoot+'/', 'utf-8'))
            .filter(f => !f.startsWith('.'))
            .filter(f => f.endsWith('.json'));
        for (const file of eventFiles) {
            const content = await fs.readFile(dataRoot + '/' + file, 'utf-8');
            events.push(JSON.parse(content));
        }
        console.log("GET eventlist: Returning event list: ", events.map(event => event.title + " : " + event.guid));
        return json(events);
    } catch (error) {
        console.error("Error fetching event list:", error);
        return json([]);
    }
}