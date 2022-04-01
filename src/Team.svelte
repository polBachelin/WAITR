<script>
    import Profile from "./Profile.svelte";
</script>

<div class="primary-container">
    <h1 class="title">What others have said</h1>
    <div class="grid">
        <Profile
            img="img/pol.jpeg"
            name="Pol Bachelin"
            skills="Développeur"
            linkedin="https://www.linkedin.com/in/polbachelin/"
            email="mailto:pol.bachelin@epitech.eu"
        />
    </div>
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
    .grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
    }
    @media (max-width: 71em) {
        .primary-container {
            margin-top: -40%;
        }
        .grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 500px) {
        .primary-container {
            margin-top: -80%;
            margin-inline: 5%;
        }
    }
</style>