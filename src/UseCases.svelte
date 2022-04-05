<script>
</script>

<div class="container flex">
    <h1 class="title">USE CASES</h1>
	<ul>
		<li>Rapid communicatoin & security</li>
        <li>Understandable economics</li>
		<li>Dynamic schedule</li>
		<li>Expansion</li>
	</ul>
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin-inline: auto;
    }
    .flex {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }
    .container {
        max-width: 40rem;
        margin-inline: auto;
        padding-inline: 3rem;
    }
    .title {
		color: var(--c-blue);

        text-align: center;
        font-size: var(--fs-xl);
        font-family: var(--ff-t);
	}
    li {
        color: var(--c-blue);
        text-align: center;
        font-size: var(--fs-l);
        font-family: var(--ff-p);
    }
    @media (max-width: 700px) {
        .container {
            margin-top: -30%;
            grid-template-columns: none;
            grid-template-rows: repeat(3, 1fr);
            gap: 2rem;
        }
    }
</style>