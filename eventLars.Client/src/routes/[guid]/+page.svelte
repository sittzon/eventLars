<script lang="ts">
    import { onMount } from "svelte";
    import { Api, type Event, type EventAnswer } from "../../api";
    import { config } from "../../config";
	import type { PageData } from './$types';
	export let data: PageData;

    let event: Event;
    let errorText: string = "";

    onMount(async () =>
    {
        // Fetch metadata
        const api = new Api();
        api.baseUrl = config.apiEndpoint;
        const response = await api.event.eventDetail(data.guid);
        
        if (response.status == 200)
        {
            event = response.data;
        }
    });

    async function submitForm() {
        const formName = document.getElementById('formName') as HTMLInputElement;
        if (!formName || !event.dates || !event.guid) {
            return;
        }
        
        let allAnswers: EventAnswer[] = [];
        event.dates.forEach((date: string) => {
            const answers = document.getElementsByName('date-'+date);
            answers.forEach(current  => {
                const c = current as HTMLInputElement;
                const v = c.value;
                if (c.checked) {
                    allAnswers = [...allAnswers, 
                        {
                            date: date,
                            [v]: true
                        }
                    ];
                }
            });
        });
        
        if (allAnswers.length != event.dates.length) {
            return;
        }

        const api = new Api();
        api.baseUrl = config.apiEndpoint;
        const response = await api.event.eventCreate2(event.guid, {answers: allAnswers, name: formName.value});

        if (response.status == 200)
        {
            window.location.href = '/thanks';
        } else {
            errorText = "Nåt gick fel, försök igen!"
        }
    }
</script>

{#if !event}
    <p><em>Laddar...</em></p>
{:else}
<div style="display:flex; flex-direction:column; align-items: center; text-align: center">
    <h1 style="margin-top: 8rem">
        {event.title}
    </h1>
    <p>
        {event.intro}
    </p>
    <p>Vilka datum kan du?</p>
</div>
    <form on:submit|preventDefault={submitForm}>
        <input hidden id="guid" name="guid" value="{event.guid}">
        <div class="form-container">
            <div>Datum</div>
            <div>Ja</div>
            <div>Kanske</div>
            <div>Nej</div>
            {#if event.dates}
                {#each event.dates as date}
                    <div><label for="date-{date}">{date}</label></div>
                    <label>
                        <input type="radio" name="date-{date}" value="yes"/>
                        <img/>
                    </label>
                    <label>
                        <input type="radio" name="date-{date}" value="maybe"/>
                        <img/>
                    </label>
                    <label>
                        <input type="radio" name="date-{date}" value="no"/>
                        <img/>
                    </label>
                {/each}
            {/if}
            <label for="formName">Namn</label>
            <input id="formName" name="formName" type="text">
            <input type="submit" value="Skicka in"/>
        </div>
        <p style="text-align: center">{errorText}</p>
    </form>
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
    .form-container label {
      font-weight: bold;
    }
    .form-container input[type="radio"] {
      width: 100%;
      height: 100%;
      display: none;
    }
    .form-container input[type="radio"] + img {
        border: '1px solid #black';
        width: 50px;
        height: 50px;
    }
    .form-container input[type="radio"]:checked + img {
        content: "";
        display: inline-block;
        background-image: url('/event.jpg');
        background-size: cover;
        cursor: pointer;
    }
    .form-container input[type="text"] {
      grid-column: span 3;
      padding: 5px;
      width: 100%;
    }
    .form-container input[type="submit"] {
      grid-column: span 4;
    }
</style>