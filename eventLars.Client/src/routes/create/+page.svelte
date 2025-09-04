<script lang="ts">
    import { json } from '@sveltejs/kit';
    import { onMount } from "svelte";
    import { Api, type Event} from "../../api";
    import { config } from "../../config";

    let eventTitle: string = "";
    let eventDescription: string = "";
    let eventDates: string[] = ["",];

    onMount(async () =>
    {
    });

    const createEvent = async () =>
    {
        const postEvent = {
            title: eventTitle,
            intro: eventDescription,
            dates: eventDates
        };

        const request = fetch("/api/event/create", {
            method: "POST",
            headers: {
                "content-type": "application/json"
            },
            body: JSON.stringify(postEvent)
        });
        await request.then((response) => {
            return response.json();
        }).then((data) => {
            if (data && data.guid)
            {
                // Redirect to event page
                window.location.href = "/" + data.guid;
            }
        });

        return;
    };

</script>

<div style="display:flex; flex-direction:column; align-items: center; text-align: center">
    <h1 style="margin-top: 8rem">
        Skapa event
    </h1>
    <form on:submit|preventDefault={createEvent}>
        <div class="container">
            <div class="form-group">
                <p>Titel:</p>
                <input type="text" placeholder="Titel" bind:value={eventTitle} required/>
            </div>
            <div class="form-group">
                <p>Beskrivning:</p>
                <textarea placeholder="Beskrivning" bind:value={eventDescription} required></textarea>
            </div>
            {#each eventDates as date, index}
            <div class="form-group">
                <p>Datum: </p>
                <input id={String(index)} type="date" bind:value={date} required />
                {#if eventDates.length > 1}
                    <input type="button" on:click={() => eventDates = eventDates.filter((_, i) => i !== index)} value="🗑️"/>
                {/if}
            </div>
            {/each}
            <div>
                <input type="button" on:click={() => eventDates = [...eventDates, ""]} value="Lägg till datum"/>
            </div>
        </div>
        <input type="submit" value="Skapa Event"/>
    </form>
</div>

<style>
    .container {
        padding: 1rem 0 1rem;
        margin: 1rem 0 1rem;
        max-width: 500px;
        width: 100%;
    }
    .form-group {
        display: grid;
        grid-template-columns: 1fr 2fr .3fr;
    }
    .form-group p {
        margin: 0 1rem 0 1rem;
        text-align: right;
    }
    .form-group:first-of-type input {
        width: 300px;
    }
    .form-group textarea {
        width: 300px;
        height: 100px;
    }
</style>