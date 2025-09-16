import { error, json } from '@sveltejs/kit';
import { type Stat } from "../../../../../api";
import { env } from '$env/dynamic/private';
import fs from 'fs/promises';

const dataRoot = env.EVENTS_ROOT || '/events';

// Read stats for specific event and return contents
export async function GET({params}) {
    try {
        // Check for traversing the file system
        if (params.guid.includes('/') || params.guid.includes('\\') || params.guid.includes('..')) {
            return json({});
        }

        const content = await fs.readFile(dataRoot + '/' + params.guid + '.json', 'utf-8');

        const eventData = JSON.parse(content);
        const stats: Stat[] = [];

        for (const currentDate of eventData.dates.sort()) {
            var stat: Stat = {
                date: currentDate,
                yes: 0 as number,
                maybe: 0 as number,
                no: 0 as number,
                yesNames: [] as string[],
                maybeNames: [] as string[],
                noNames: [] as string[]
            };

            for (const a of eventData.answers) {
                const name = a.name;
                for (const answer of a.answers.filter((x: any) => x.date === currentDate)) {
                    if (answer.yes === true) {
                        stat.yes! += 1;
                        stat.yesNames!.push(name);
                    }
                    if (answer.maybe === true) {
                        stat.maybe! += 1;
                        stat.maybeNames!.push(name);
                    }
                    if (answer.no === true) {
                        stat.no! += 1;
                        stat.noNames!.push(name);
                    }
                }
            }
            stats.push(stat);
        }

        console.log("GET stats: Fetched stats data", params.guid);
        return json({
            guid: params.guid,
            datesAndAnswers: stats
        });
    } catch (error) {
        console.error("Error fetching event list:", error);
        return json({});
    }
}