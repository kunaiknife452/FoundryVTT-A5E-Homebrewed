<script>
    import { fade } from "svelte/transition";

    import CompendiumManeuverFilters from "./CompendiumManeuverFilters.svelte";
    import CompendiumMonsterFilters from "./CompendiumMonsterFilters.svelte";
    import CompendiumObjectFilters from "./CompendiumObjectFilters.svelte";
    import CompendiumOriginFilters from "./CompendiumOriginFilters.svelte";
    import CompendiumSpellFilters from "./CompendiumSpellFilters.svelte";
    import CompendiumClassFeatureFilters from "./CompendiumClassFeatureFilters.svelte";

    export let compendiumType;

    const compendiumItemComponents = {
        "5eSpell": CompendiumSpellFilters,
        classFeature: CompendiumClassFeatureFilters,
        object: CompendiumObjectFilters,
        magicItem: CompendiumObjectFilters,
        maneuver: CompendiumManeuverFilters,
        monster: CompendiumMonsterFilters,
        spell: CompendiumSpellFilters,

        archetype: CompendiumOriginFilters,
    };
</script>

<section class="filter-page" transition:fade>
    <svelte:component this={compendiumItemComponents[compendiumType]} {compendiumType} />
</section>

<style lang="scss">
    .filter-page {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        grid-area: main;
        overflow-y: auto;
    }
</style>
