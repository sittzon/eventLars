import { error, json } from '@sveltejs/kit';
import fs from 'fs/promises';
import {v4 as uuidv4} from 'uuid';

const dataRoot = './events';

// Create new event and save
export async function POST({request}) {
    const data = await request.json();
    
    // Validate event data
    if (!data || typeof data !== 'object') {
        console.error("Invalid event data received:", data);
        return json({ error: "Event data is invalid." }, { status: 400 });
    }
    
    // Check required fields
    if (!data.title || !data.intro) {
        console.error("Event data missing required fields:", data);
        return json({ error: "Event must include Title and Intro data." }, { status: 400 });
    }
    
    // Create new event object with a GUID
    const guid = uuidv4();
    const event: Event = {
        ...data,
        guid: guid
    };

    // Save event to a unique file
    await fs.mkdir(dataRoot, { recursive: true });
    const fileName = `${dataRoot}/${guid}.json`;
    // console.log("Saving new event to file: ", fileName);

    try {
        // Check if event already exists
        try {
            await fs.access(fileName);
            return json({ error: "Event already exists" }, { status: 400 });
        } catch {
            // File does not exist, continue
        }

        await fs.writeFile(fileName, JSON.stringify(event, null, 2));
        console.log(`POST create: Created event ${fileName}`);
        return json({ guid }, { status: 201 });
    } catch (err) {
        console.error("Failed to create event:", err);
        return json({ error: "Internal server error" }, { status: 500 });
    }
}