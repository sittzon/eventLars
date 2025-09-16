import { json } from '@sveltejs/kit';
import { type Event, type EventAnswer  } from "../../../../api";
import { env } from '$env/dynamic/private';
import fs from 'fs/promises';

const dataRoot = env.EVENTS_ROOT || '/events';

// Read specific event and return contents
export async function GET({params}) {
    try {
        // Check for traversing the file system
        if (params.guid.includes('/') || params.guid.includes('\\') || params.guid.includes('..')) {
            console.warn("GET event: Invalid GUID content", { params });
            return json({});
        }

        const content = await fs.readFile(dataRoot + '/' + params.guid + '.json', 'utf-8');
        console.log("GET [guid]: Fetched event data", params.guid);
        return json(JSON.parse(content));
    } catch (error) {
        console.error("Error fetching event list:", error);
        return json({});
    }
}

// Submit answers for specific event
export async function POST({params, request}) {
    const {allAnswers, name} = await request.json();

    // Validate input
    if (
        !params.guid ||
        typeof name !== 'string' ||
        !name.trim() ||
        !Array.isArray(allAnswers) ||
        allAnswers.length === 0
    ) {
        console.warn("POST event: Invalid input received", { params, name, allAnswers });
        return new Response('Invalid input', { status: 400 });
    }

    // No traversing the filesystem
    if (
        params.guid.includes('/') ||
        params.guid.includes('\\') ||
        params.guid.includes('..')
    ) {
        console.warn("POST event: Invalid GUID content", { params });
        return new Response('Invalid GUID', { status: 400 });
    }

    // Read event data
    const fileName = `${dataRoot}/${params.guid}.json`;
    try {
        await fs.access(fileName);
    } catch {
        console.warn("POST event: Event file does not exist", { fileName });
        return new Response('Event not found', { status: 400 });
    }

    let eventData: Event;
    try {
        const bytes = await fs.readFile(fileName, 'utf-8');
        eventData = JSON.parse(bytes);
    } catch {
        console.warn("POST event: Failed to read event", { fileName });
        return new Response('Failed to read event', { status: 400 });
    }

    if (!eventData) {
        console.warn("POST event: Event data is invalid", { fileName });
        return new Response('Event not found', { status: 400 });
    }

    // Create Answers array if not exists
    if (!Array.isArray(eventData.answers)) {
        eventData.answers = [];
    }

    // Check if Answers already exist from same person
    if (eventData.answers.some((x: EventAnswer) => x.name === name)) {
        return new Response('Duplicate name', { status: 400 });
    }

    // Append answers from person
    eventData.answers.push({
        name: name,
        answers: allAnswers
    });

    try {
        await fs.writeFile(fileName, JSON.stringify(eventData, null, 2), 'utf-8');
    } catch {
        return new Response('Failed to write event', { status: 500 });
    }

    console.log("POST [guid]: Saved answers for event", { fileName, name, allAnswers });
    return new Response(null, { status: 200 });
}