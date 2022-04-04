<script>
</script>

<div class="col">
    <h1 class="title">USE CASES</h1>
</div>
<div class="container">
	<ul>
		<div class="col">
			<p>Key features :</p>
		</div>
		<li>Understandable economics</li>
		<li>Dynamic schedule</li>
		<li>Expansion</li>
		<li>Rapid communicatoin & security</li>
	</ul>
</div>

<style>
    .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        margin-inline: auto;
    }
    .col {
        align-items: center;
    }
    .title {
		color: var(--c-blue);

        text-align: center;
        font-size: var(--fs-xl);
        font-family: var(--ff-t);
	}
	.mt-3 {
		margin-top: 3.5%;
	}
	.icon {
		width: 15%;
		margin: auto;
		display: block;
	}
    @media (max-width: 700px) {
        .container {
            margin-top: -30%;
            grid-template-columns: none;
            grid-template-rows: repeat(3, 1fr);
            gap: 2rem;
        }
        .icon {
            width: 10%;
        }
    }
</style>