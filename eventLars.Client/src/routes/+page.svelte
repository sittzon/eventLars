<script lang="ts">
    import { json } from '@sveltejs/kit';
    import { onMount } from "svelte";
    import { Api, type Event} from "../api";
    import { config } from "../config";

    let eventList: Event[];

    onMount(async () =>
    {
        const dbEventlist = "/api/eventlist"

        const request = fetch(dbEventlist, {
			method: 'GET',
			headers: {
				'content-type': 'application/json'
			}
        });
        await request.then((response) => {
            if (response.status == 200)
            {
                return response.json();
            }
        }).then((data) => {
            eventList = data;
        });
    });

</script>

<div style="display:flex; flex-direction:column; align-items: center; text-align: center">
    {#if !eventList}
        <p><em>Laddar...</em></p>
    {:else}
        <h1 style="margin-top: 8rem">
            Välkommen till EventLars!
        </h1>
        <p>Vilket event vill du rösta på?</p>
        {#each eventList as event}
            <h2><a href="/{event.guid}">{event.title}</h2>
        {/each}
    {/if}
</div>