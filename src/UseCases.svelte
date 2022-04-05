<script>
</script>

<div class="flex">
    <h1 class="title">USE CASES</h1>
	<ul>
		<li>Rapid communicatoin & security</li>
        <li>Understandable economics</li>
		<li>Dynamic schedule</li>
		<li>Expansion</li>
	</ul>
</div>

<style>
    .flex {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
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
        .flex {
            margin-top: 23%;
            grid-template-columns: none;
            grid-template-rows: repeat(3, 1fr);
        }
    }
</style>