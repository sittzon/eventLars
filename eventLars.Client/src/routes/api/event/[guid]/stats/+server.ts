import { error, json } from '@sveltejs/kit';
import fs from 'fs/promises';

const dataRoot = './events';

class Stat {
    date!: string;
    yes!: number;
    no!: number;
    maybe!: number;
    yesNames!: string[];
    maybeNames!: string[];
    noNames!: string[];
}

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
            const stat = new Stat();
            stat.date = currentDate;
            stat.yes = 0;
            stat.maybe = 0;
            stat.no = 0;
            stat.yesNames = [];
            stat.maybeNames = [];
            stat.noNames = [];

            for (const a of eventData.answers) {
                const name = a.name;
                for (const answer of a.answers.filter((x: any) => x.date === currentDate)) {
                    if (answer.yes === true) {
                        stat.yes += 1;
                        stat.yesNames.push(name);
                    }
                    if (answer.maybe === true) {
                        stat.maybe += 1;
                        stat.maybeNames.push(name);
                    }
                    if (answer.no === true) {
                        stat.no += 1;
                        stat.noNames.push(name);
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