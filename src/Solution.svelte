<script>
</script>

<div class="container flex">
	<div class="flex">
		<img class="planet" src="img/icon_solution.png" alt="planet_image">
	</div>
	<div class="article">
		<div>
			<h1>Our solution</h1>
			<p>
				Holds4u, is a company that offers to transform waiting lines into a gig economy.
				An app that helps you not have to wait in lines anymore. We hire independent contractors as waiters to wait in line for you.
				Or you can make money by becoming an independent contractor and work whenever you feel like it.
				This solution is for anyone that does not want to wait in line anymore.
			</p>
		</div>
	</div>
</div>

<style>
	.container {
		margin-block: 10rem;
		/* box-shadow: 10px 10px 10px 10px #c9c9c9; */
	}
	.flex {
		display: flex;
		justify-content: space-evenly;
		align-items: center;
	}
	.article {
        max-width: 40rem;
        margin-inline: auto;
        padding-inline: 3rem;
	}
    h1 {
		color: var(--c-blue);
        font-family: var(--ff-t);
		font-weight: normal;
		font-size: var(--fs-xl);
	}
	p {
        font-family: var(--ff-p);
		color: #858585;
        font-size: var(--fs-s);
	}
	.planet {
		width: 30rem;
		margin: auto;
	}

	@media (max-width: 71rem) {
		.flex {
			flex-direction: column;
		}
		.article {
			max-width: 40rem;
		}
		h1 {
			text-align: center;
		}
		.planet {
			width: 70%;
		}
	}
	@media (max-width: 50rem) {
		.container {
			box-shadow: none;
		}
	}
</style>