<script lang="ts">
    import { onMount } from "svelte";
    import { Api, type Event, type Stats} from "../../../api";
    import { config } from "../../../config";
	import type { PageData } from './$types';
	export let data: PageData;

    let event: Event;
    let stats: Stats;

    onMount(async () =>
    {
        const dbEvent = "/api/event/" + data.guid ;
        const dbStats = "/api/event/" + data.guid + "/stats";

        let request = fetch(dbEvent, {
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
            event = data;
        });

        request = fetch(dbStats, {
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
            stats = data;
        });
    });
</script>

{#if !event}
    <div style="display:flex; flex-direction:column; align-items: center; text-align: center">
        <p><em>Laddar...</em></p>
    </div>
{:else}
<div style="display:flex; flex-direction:column; align-items: center; text-align: center">
    <h1 style="margin-top: 8rem">
        {event.title}
    </h1>
</div>
    <div class="form-container">
        <div>Datum</div>
        <div>Ja</div>
        <div>Kanske</div>
        <div>Nej</div>
        {#if event.dates}
            {#each event.dates as date, index}
                <b>{date}</b>
                {#if stats}
                    <div>{stats.datesAndAnswers?.at(index)?.yes}</div>
                    <div>{stats.datesAndAnswers?.at(index)?.maybe}</div>
                    <div>{stats.datesAndAnswers?.at(index)?.no}</div>
                {/if}
            {/each}
        {/if}
    </div>
{/if}

<style>
    .form-container {
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 0.5rem;
      width: 100%;
      max-width: 500px;
      margin: 0.5rem auto;
      padding: 1rem;
      border-radius: 10px;
      text-align: center;
      align-items: center;
    }
    .form-container div {
      padding: 5px;
    }
</style>