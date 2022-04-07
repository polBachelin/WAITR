<script>
</script>

<footer>
    <div class="container flex">
        <div class="center-items" style="padding-block: 1rem;">
            <h1>Contact us !</h1>
        </div>
        <div class="reseaux">
            <a href="https://www.linkedin.com/in/waitr-llc-4a50a8237/">
                <img class="icon" src="icon/linkedinBlue.png" alt="contact_linkedin_NuageMalin">
            </a>
            <a href="https://twitter.com/WAITR_LLC/">
                <img class="icon" src="icon/twitter.png" alt="contact_twitter_NuageMalin">
            </a>
        </div>
        <div class="center-items">
            <h3>waitr@protonmail.com</h3>
        </div>
        <!-- <div class="lien">
            <a href="/404">Conditions générales de vente</a> - 
            <a href="/404">Politique de confidentialité</a>
            -
            <a href="/404">Mentions Légales</a>
            -
            <a href="/404">Attestation conformité RGPD</a>
        </div> -->
    </div>
</footer>

<style>
    footer {
        position: absolute;
        width: 100%;
        z-index: 9000;
        margin-top: -10%;
        background-color: white;
    }
    .flex {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
    .container {
        max-width: 50rem;
        margin-inline: auto;
        padding-inline: 3rem;
    }
    .center-items {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
    }
    .reseaux {
        display: flex;
        gap: 3rem;
        justify-content: center;
    }
    h1 {
        margin-block: 0;
        margin-inline: 0;
		color: var(--c-blue);
        font-weight: normal;
        font-family: var(--ff-t);
        font-size: var(--fs-xl);
	}
    h3 {
        margin-block: 1em;
        color: var(--c-blue);
        font-weight: normal;
        font-family: var(--ff-t);
        font-size: var(--fs-l);
    }
    .icon {
        width: 2rem;
    }
    @media (max-width: 71em) {
        footer {
            margin-top: -25%;
        }
        .icon {
            width: 2rem;
        }
    }
    @media (max-width: 25em) {
        footer {
            margin-top: -50%;
        }
        .center-items {
            flex-direction: column;
        }
    }
</style>