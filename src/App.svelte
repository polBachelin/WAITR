<script>
	import NavBar from "./NavBar.svelte";
	import WhoAreUS from "./WhoAreWe.svelte"
	import Resume from "./Resume.svelte"
	import Solution from "./Solution.svelte"
	import Feedback from "./Feedback.svelte"
	import Footer from "./Footer.svelte"
	import UseCases from './UseCases.svelte'
	import MainFrame from "./MainFrame.svelte"
	import Newsletter from './newsletterForm.svelte'
    import Not404 from "./404not404.svelte";
    import { Router, Route } from "svelte-routing";
	import { Parallax, ParallaxLayer } from 'svelte-parallax'
	let resume = 3.11;

    export const url = "";
</script>

<svelte:head>
    <style>
        @import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap");
        @import url("https://fonts.googleapis.com/css2?family=Hammersmith+One&display=swap");
    </style>
	<script id="mcjs">!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/be9a22b4c27af49601b51c521/1e9c712ef0db241c5a12d27f9.js");</script>
</svelte:head>




<div id="solution" style="position: relative; top: 0px;"/>
<div id="benefits" style="position: relative; top: 900px;"/>
<div id="whoAreUs" style="position: relative; top: 1750px;"/>
<div id="feedback" style="position: relative; top: 2500px;"/>
<div id="contact" style="position: relative; top: 3000px;"/>
<Router {url}>
    <Route path="*">
		<NavBar route="/" />
		<Parallax sections={4} config={{stiffness: 0.3}}>
			<ParallaxLayer rate={0} offset={0} style={"background-color: white; display: flex !important; justify-content: center !important;"}>
				<Solution />
			</ParallaxLayer>
			<ParallaxLayer rate={0} offset={1}>
				<img class="banner" src="img/BannerWAITR.png" alt="banner">
			</ParallaxLayer>
			<ParallaxLayer rate={0} offset={1.1}>
				<Resume />
			</ParallaxLayer>
			<ParallaxLayer rate={0} offset={1.5}>
				<UseCases />
			</ParallaxLayer>
			<ParallaxLayer rate={0} offset={1.9} style={"background-color: white; display: flex !important; justify-content: center !important;"}>
				<WhoAreUS />
			</ParallaxLayer>
			<ParallaxLayer rate={0} offset={2.9}>
				<img class="banner" src="img/BannerWAITR.png" alt="banner">
			</ParallaxLayer>
			<ParallaxLayer rate={0} offset={3.6}>
				<Feedback />
				<br>
				<Newsletter/>
			</ParallaxLayer>
		</Parallax>
		<Footer />
	</Route>
	<!-- <Route path="*">
        <NavBar route="404"/>
        <MainFrame>
            <Not404 />
        </MainFrame>
    </Route> -->
</Router>

<style>
	:root {
		/* Font Family */
		--ff-t: "Hammersmith One", sans-serif;
		--ff-p: "Quicksand", sans-serif;
		/* Font-Size */
        --fs-xl: clamp(1.5rem, 1vw + 1rem, 2.5rem);
        --fs-l: clamp(1rem, 1vw + 0.7rem, 2rem);
        --fs-m: clamp(0.9rem, 1vw + 0.2rem, 1.8rem);
        --fs-s: clamp(0.8rem, 1vw + 0.6rem, 1.2rem);
        --fs-xs: clamp(0.8rem, 1vw + 0.1rem, 1rem);
		/* Color */
		--c-gray: #edf2fb;
		--c-blue-sky: #6987C9;
		--c-blue-sky2: #6987C9;
		--c-blue: #0a2342;
		--c-green: #2CA58D; 
    }
	.banner {
		width: 100%;
		height: 909px;
		object-fit: cover;
	}
</style>