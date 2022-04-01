<script lang="ts">
    let bool = false;

    function toggle_menu() {
        if (bool === false) {
            bool = true;
        } else {
            bool = false;
        }
    }

</script>

<header class="nav flex shadow">
    <a class="title" href="/">
        <img class="logo" src="img/WAITR_logo_noText.png" alt="logo" />
        WAITR
    </a>
    <button class="icon-toggle" on:click={toggle_menu}><img src="svg/iconMenu.svg" alt="icon_menu"></button>
    <ul data-visible={bool} class="nav-right flex ligne">
        <li><a href="#whoAreUs">Who are we ?</a></li>
        <li><a href="#solution">Our solution</a></li>
        <li><a href="#team">What others have said</a></li>
        <li><a href="#contact">Contact Us</a></li>
    </ul>
</header>

<style>

    .flex {
        display: flex;
        gap: 4rem;
    }
    .nav {
	    box-sizing: border-box;
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;

        align-items: center;
        justify-content: space-between;

        width: 100%;
        padding: 20px;
        margin: 0;

        background-color: white;
    }
    .nav-right a {
        color: var(--c-blue);
    }
    .shadow {
        box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
    }
    a {
        padding: 0;
        margin: 0;
    }
    ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .title {
        width: 27%;
        font-family: var(--ff-t);
        font-size: 30px;
        color: var(--c-blue);
    }
    .logo {
        width: 5rem;
        margin-inline: 5%;
        vertical-align: middle;
    }
    .icon-toggle {
        display: none;
    }
    .nav-right[data-visible="true"] {
        transform: translateX(0%);
    }

    @media (max-width: 71em) {
        .title {
            width: 100%;
        }
        .icon-toggle {
            position: absolute;
            display: block;
            z-index: 9999;

            right: 1rem;
            border: none;
            background: transparent;
        }
        .nav-right {
            position: fixed;
            inset: 0 0 0 50%;

            background-color: #2CA58D;
            backdrop-filter: blur(0.5rem);

            padding: min(30vh, 10rem) 3rem;
            flex-direction: column;
            width: 60%;

            transform: translateX(100%);
            transition: transform 600ms ease-out;
        }
        .nav-right a {
            font-size: 15px;
        }
        li {
            padding-bottom: 30px;
            border-bottom: 1.5px solid;
            border-color: #6987C9;
        }
    }

    @media (max-width: 23em) {
        .logo {
            margin-inline: 1%;
        }
        .nav-right {
            padding: min(30vh, 10rem) 2rem;
        }
        .nav-right a {
            font-size: 12px;
        }
    }
</style>
