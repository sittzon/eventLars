<script lang="ts">
    import { onMount } from "svelte";
    import { Api, type Event} from "../api";
    import { config } from "../config";

    let eventList: Event[];

    onMount(async () =>
    {
        const api = new Api();
        api.baseUrl = config.apiEndpoint;
        const response = await api.event.eventList();
        
        if (response.status == 200)
        {
            eventList = response.data;
        }
    });

</script>

{#if !eventList}
    <p><em>Laddar...</em></p>
{:else}
    <div style="display:flex; flex-direction:column; align-items: center; text-align: center">
        <h1 style="margin-top: 8rem">
            Välkommen till EventLars!
        </h1>
        <p>Vilket event vill du rösta på?</p>
        {#each eventList as event}
            <h2><a href="/{event.guid}">{event.title}</h2>
        {/each}
    </div>
{/if}