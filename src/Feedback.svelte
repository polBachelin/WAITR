<script>
    import Profile from "./Profile.svelte";

    import { onMount } from 'svelte';

    let Carousel; // for saving Carousel component class
    let carousel; // for calling methods of the carousel instance
    onMount(async () => {
    const module = await import('svelte-carousel');
    Carousel = module.default;
    });

    const handleNextClick = () => {
    carousel.goToNext()
    }
</script>

<div class="primary-container">
    <h1 class="title">What others have said</h1>
    <svelte:component
      this={Carousel}
    bind:this={carousel}
    >
    <div>This is such a great idea, I can't stand waiting in line !</div>
    <div>2</div>
    <div>3</div>
    </svelte:component>
    <!-- <div class="grid">
        <Profile
            img="img/pol.jpeg"
            name="Pol Bachelin"
            skills="Développeur"
            linkedin="https://www.linkedin.com/in/polbachelin/"
            email="mailto:pol.bachelin@epitech.eu"
        />
    </div> -->
</div>

<style>
    .primary-container {
        background: white;
        border-radius: 20px;
        margin-inline: 15%;
        margin-top: -20%;
        padding-block: 2rem;
    }
    h1 {
		text-align: center;
		color: var(--c-blue);
        font-family: var(--ff-t);
        font-weight: normal;
        font-size: var(--fs-xl);
	}
    /* .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    } */
    @media (max-width: 71em) {
        .primary-container {
            margin-top: -40%;
        }
        /* .grid {
            grid-template-columns: repeat(2, 1fr);
        } */
    }
    @media (max-width: 500px) {
        .primary-container {
            margin-top: -80%;
            margin-inline: 5%;
        }
    }
</style>