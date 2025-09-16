<script lang="ts">
    import { onMount } from "svelte";
    import { type Event, type Stats} from "../../../api";
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

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    });

  let openIndex: number | null = null; // track which date’s tooltip is open

  // Close tooltip when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (!event.target.closest(".tooltip-container")) {
      openIndex = null;
    }
  }
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
                <!-- svelte-ignore a11y-click-events-have-key-events -->
                <!-- svelte-ignore a11y-no-static-element-interactions -->
                <div class="tooltip-container {openIndex === index ? 'active' : ''}"
                on:click={() => openIndex = openIndex === index ? null : index}>
                    <b>{date}</b>
                    <div class="tooltip">
                        {#if stats}
                            <b>{date}</b>
                            {#if stats.datesAndAnswers?.at(index)?.yesNames?.length > 0}
                                <p><b>Ja:</b> {stats.datesAndAnswers?.at(index)?.yesNames.join(", ")}</p>
                            {/if}
                            {#if stats.datesAndAnswers?.at(index)?.maybeNames?.length > 0}
                                <p><b>Kanske:</b> {stats.datesAndAnswers?.at(index)?.maybeNames.join(", ")}</p>
                            {/if}
                            {#if stats.datesAndAnswers?.at(index)?.noNames?.length > 0}
                                <p><b>Nej:</b> {stats.datesAndAnswers?.at(index)?.noNames.join(", ")}</p>
                            {/if}
                        {/if}
                    </div>
                </div>
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
    .tooltip-container {
        position: relative;
        display: inline-block;
        cursor: pointer;
        margin-right: 1rem;
    }

    .tooltip {
        visibility: hidden;
        opacity: 0;
        width: 220px;
        background-color: #333;
        color: #fff;
        text-align: left;
        border-radius: 6px;
        padding: 6px;
        position: absolute;
        z-index: 1;
        bottom: 125%; /* above the date */
        left: 90%;
        transform: translateY(70%);
        transition: opacity 0.2s;
        pointer-events: none; /* prevents hover flicker */
    }

    .tooltip-container:hover .tooltip,
    .tooltip-container.active .tooltip {
        visibility: visible;
        opacity: 1;
        pointer-events: auto;
    }
</style>