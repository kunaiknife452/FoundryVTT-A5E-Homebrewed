<script>
    import { getContext } from "svelte";
    import { TJSDocument } from "#runtime/svelte/store/fvtt/document";

    import CheckboxGroup from "../components/CheckboxGroup.svelte";
    import ExpertiseDiePicker from "../components/ExpertiseDiePicker.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";
    import RadioGroup from "../components/RadioGroup.svelte";

    import getRollFormula from "../../utils/getRollFormula";
    import RollModePicker from "../components/RollModePicker.svelte";

    export let { document, dialog, options } = getContext("#external").application;

    function getInitialExpertiseDieSelection() {
        if (hideExpertiseDice) return 0;

        return options.expertiseDice ?? $actor.system.attributes.initiative.expertiseDice;
    }

    const actor = new TJSDocument(document.actor);
    const appId = dialog.id;
    const abilities = CONFIG.A5E.abilities;
    const hideExpertiseDice = game.settings.get("a5e", "hideExpertiseDice");

    function onSubmit() {
        dialog.submit({ rollFormula });
    }

    let abilityKey =
        options.abilityKey ?? $actor.system.attributes.initiative.ability ?? "dex";

    let expertiseDie = getInitialExpertiseDieSelection();
    let rollFormula;
    let selectedRollMode = options.rollMode ?? CONFIG.A5E.ROLL_MODE.NORMAL;
    let situationalMods = options.situationalMods ?? "";

    let rollMode = $actor.RollOverrideManager.getRollOverride(
        `initiative`,
        selectedRollMode,
        { ability: abilityKey },
    );

    let rollModeString = $actor.RollOverrideManager.getRollOverridesSource(
        `initiative`,
        selectedRollMode,
        { ability: abilityKey },
    );

    $: abilityBonuses = $actor.BonusesManager.prepareAbilityBonuses(abilityKey, "check");

    $: initiativeBonuses = $actor.BonusesManager.prepareInitiativeBonuses({
        abilityKey,
    });

    $: selectedAbilityBonuses = $actor.BonusesManager.getDefaultSelections("abilities", {
        abilityKey,
        abilityType: "check",
    });

    $: selectedInitiativeBonuses = $actor.BonusesManager.getDefaultSelections(
        "initiative",
        { abilityKey },
    );

    $: rollFormula = getRollFormula($actor, {
        ability: abilityKey,
        expertiseDie,
        rollMode,
        situationalMods,
        selectedAbilityBonuses,
        selectedInitiativeBonuses,
        type: "initiative",
    });
</script>

<form>
    <RollModePicker
        selected={selectedRollMode}
        source={rollModeString}
        on:updateSelection={({ detail }) => (selectedRollMode = detail)}
    />

    <RadioGroup
        heading="A5E.AbilityScore"
        options={Object.entries(abilities)}
        selected={abilityKey}
        on:updateSelection={({ detail }) => (abilityKey = detail)}
    />

    <ExpertiseDiePicker
        selected={expertiseDie}
        type={$actor.type}
        on:updateSelection={(event) => {
            expertiseDie = event.detail;
        }}
    />

    {#if Object.values(abilityBonuses).flat().length}
        <CheckboxGroup
            heading="Ability Bonuses"
            options={abilityBonuses.map(([key, abilityBonus]) => [
                key,
                abilityBonus.label || abilityBonus.defaultLabel,
            ])}
            selected={selectedAbilityBonuses}
            on:updateSelection={({ detail }) => (selectedAbilityBonuses = detail)}
        />
    {/if}

    {#if Object.values(initiativeBonuses).flat().length}
        <CheckboxGroup
            heading="Initiative Bonuses"
            options={initiativeBonuses.map(([key, initiativeBonus]) => [
                key,
                initiativeBonus.label || initiativeBonus.defaultLabel,
            ])}
            selected={selectedInitiativeBonuses}
            on:updateSelection={({ detail }) => (selectedInitiativeBonuses = detail)}
        />
    {/if}

    <FieldWrapper heading="A5E.SituationalMods">
        <input class="a5e-input" type="text" bind:value={situationalMods} />
    </FieldWrapper>

    <section class="roll-formula-preview">
        {rollFormula}
    </section>

    <section>
        <button on:click|preventDefault={onSubmit}>Roll Initiative</button>
    </section>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }

    .roll-formula-preview {
        padding: 0.5rem;
        font-size: var(--a5e-text-size-sm);
        border: 1px solid #7a7971;
        border-radius: 4px;
    }
</style>
