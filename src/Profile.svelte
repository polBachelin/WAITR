<script lang="ts">
    export let img;
    export let name;
    export let skills;
    export let linkedin;
    export let email;
</script>

<div class="container">
    <img class="picture" src={img} alt="{name}">
    <h1 class="title">{name}</h1>
    <p>{skills}</p>
    <div class="flex">
        <a href={linkedin} target="_blank">
            <img class="icon-fit" src="icon/linkedin.png" alt="icon_linkedin">
        </a>
        <a href={email}>
            <img class="icon-fit" src="icon/email.png" alt="icon_email">
        </a>
    </div>
</div>

<style>
    .container {
		padding-block: 2rem;
    }
    h1 {
		text-align: center;
		color: var(--c-blue);
        font-weight: normal;
        font-size: var(--fs-l);
        font-family: var(--ff-t);
	}
    p {
		text-align: center;
        font-family: var(--ff-p);
		color: #858585;
        font-size: var(--fs-xs);
	}
    .flex {
        display: flex;
        justify-content: center;
        gap: 2rem;
    }
	.icon-fit {
		width: 2rem;
	}
	.picture {
        display: block;
		border-radius: 100%;
        width: 10rem;
        margin: auto;
	}
    @media (max-width: 71em) {
        .picture {
            width: 8rem;
        }
        .icon-fit {
		    width: 1.5rem;
	    }
    }
</style>