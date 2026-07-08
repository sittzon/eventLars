<script lang="ts">
    import { onMount } from "svelte";
    import { type Event} from "../api";

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
    <h1 style="margin-top: 8rem">
        Välkommen till EventLars!
    </h1>
    {#if !eventList}
        <p><em>Laddar...</em></p>
    {:else}
        {#if eventList.length > 0}
            <div style="margin-top: 2rem"/>
            <p>Vilket event vill du rösta på?</p>
            {#each eventList as event}
            <h2><a href="/{event.guid}">{event.title}</h2>
            {/each}
        {/if}
        <div style="margin-top: 2rem"/>
        <p>{#if eventList.length > 0}Eller vill{:else}Vill{/if} du <a href="/create">skapa ett event</a>?</p>
    {/if}
</div>