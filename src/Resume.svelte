<script>
</script>

<div class="col">
    <h1 class="title">THE BENEFITS</h1>
</div>
<div class="container">
    <div class="col">
        <img class="icon" src="icon/wait.png" alt="icon team">
        <div class="mt-3 title">Stop</div>
        <div class="title">waiting</div>
    </div>
    <div>
        <img class="icon" src="icon/salary.png" alt="icon map">
        <div class="mt-3 title">Start</div>
        <div class="title">earning</div>
    </div>
    <div>
        <img class="icon" src="icon/snap.png" alt="icon target">
        <div class="mt-3 title">Easy to </div>
        <div class="title">use</div>
    </div>
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
            margin-top: 10%;
            grid-template-columns: none;
            grid-template-rows: repeat(3, 1fr);
            gap: -1rem;
        }
        .icon {
            width: 8%;
        }
    }
</style>