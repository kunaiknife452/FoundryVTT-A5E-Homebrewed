<script>
    import { getContext } from "svelte";

    import getHPComponents from "../../../utils/getHPComponents";
    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Section from "../Section.svelte";
    import FieldWrapper from "../FieldWrapper.svelte";
    import RadioGroup from "../RadioGroup.svelte";
    import getDeterministicBonus from "../../../dice/getDeterministicBonus";
    import CheckboxGroup from "../CheckboxGroup.svelte";

    const item = getContext("item");
    const abilities = { none: "None", ...CONFIG.A5E.abilities };
    const abilitiesWithoutNone = CONFIG.A5E.abilities;
    const casterTypes = CONFIG.A5E.casterTypes;

    function getHpData() {
        const actor = $item.actor;
        if (!actor) {
            return { totalHp: 0, hpBonusPerLevel: 0, otherHpBonuses: 0 };
        }

        const totalHp = getHPComponents($item.parent);
        const hpBonusPerLevel =
            getDeterministicBonus(
                actor.BonusesManager.getHitPointsBonusPerLevelFormula() ?? 0,
                actor?.getRollData(),
            ) ?? 0;

        const allHpBonuses =
            getDeterministicBonus(
                actor.BonusesManager.getHitPointsBonusFormula() ?? 0,
                actor.getRollData(),
            ) ?? 0;

        const otherHpBonuses = allHpBonuses - hpBonusPerLevel * actor.levels.character;

        const tempBonuses = actor.system.attributes.hp.bonus;

        return {
            totalHp,
            hpBonusPerLevel,
            otherHpBonuses: otherHpBonuses + tempBonuses,
        };
    }

    const hitDiceSize = [
        [6, "d6"],
        [8, "d8"],
        [10, "d10"],
        [12, "d12"],
    ];

    $: classLevel = $item.system.classLevels;
    $: hpData = getHpData($item.actor);
</script>

<article class="a5e-page-wrapper a5e-page-wrapper--scrollable">
    <Section heading="Metadata" --a5e-section-body-gap="0.75rem">
        <FieldWrapper
            heading="Class Identifier"
            --a5e-field-wrapper-header-item-justification="flex-start"
            --a5e-field-wrapper-header-gap="0.5rem"
        >
            <div style="display: flex; gap: 0.5rem">
                <input
                    class="a5e-input a5e-input--slim slug-input"
                    value={$item.system.slug || $item.slug || ""}
                    type="text"
                    on:change={({ target }) => {
                        updateDocumentDataFromField(
                            $item,
                            "system.slug",
                            target.value.slugify({ strict: true }),
                        );
                    }}
                />

                <button
                    class="slug-reset-button"
                    on:click={() => updateDocumentDataFromField($item, "system.slug", "")}
                >
                    <i class="fas fa-solid fa-rotate-left" />
                </button>
            </div>
        </FieldWrapper>

        <FieldWrapper
            heading="Archetype Level"
            hint="The level at which the archetypes are first chosen."
            --a5e-field-wrapper-header-gap="0.5rem"
        >
            <input
                class="a5e-input a5e-input--slim a5e-input--small"
                type="number"
                min="0"
                value={$item.system.archetypeLevel}
                on:change={({ target }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.archetypeLevel",
                        Number(target.value),
                    )}
            />
        </FieldWrapper>
    </Section>

    <Section heading="Hit Dice" --a5e-section-body-gap="0.75rem">
        <RadioGroup
            heading="Hit Dice Size"
            options={hitDiceSize}
            selected={$item.system.hp.hitDiceSize}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField($item, "system.hp.hitDiceSize", detail)}
        />

        {#if $item.actor}
            <FieldWrapper heading="Hit Dice Used">
                <input
                    class="a5e-input a5e-input--small a5e-input--slim"
                    type="number"
                    max={classLevel}
                    min="0"
                    value={$item.system.hp.hitDiceUsed}
                    on:change={({ target }) =>
                        updateDocumentDataFromField(
                            $item,
                            "system.hp.hitDiceUsed",
                            Number(target.value),
                        )}
                />
            </FieldWrapper>
        {/if}
    </Section>

    {#if $item.actor}
        <Section heading="Hit Points" --a5e-section-body-gap="0.75rem">
            <div class="a5e-class-hp-table">
                <header class="a5e-class-hp-table__header">
                    <h3 class="a5e-class-hp-table__heading">Level</h3>
                    <h3 class="a5e-class-hp-table__heading">Base HP</h3>
                    <h3 class="a5e-class-hp-table__heading">Con Mod</h3>
                    <h3 class="a5e-class-hp-table__heading">Bonus HP</h3>
                    <h3 class="a5e-class-hp-table__heading">Total HP</h3>
                </header>

                <hr class="a5e-class-hp-table__rule" />

                {#each Object.entries($item.system.hp.levels) as [level, hp]}
                    {#if hp}
                        <span class="a5e-class-hp-table__field">
                            {level}
                        </span>

                        <input
                            class="a5e-class-hp-table__field"
                            type="number"
                            value={hp ?? 0}
                            min="0"
                            on:change={({ target }) =>
                                updateDocumentDataFromField(
                                    $item,
                                    `system.hp.levels.${level}`,
                                    Number(target.value),
                                )}
                        />

                        <!-- TODO: Make this reactive -->
                        <span class="a5e-class-hp-table__field">
                            {$item.actor.system.abilities.con.check.mod}
                        </span>

                        <span class="a5e-class-hp-table__field">
                            {hpData.hpBonusPerLevel}
                        </span>

                        <span class="a5e-class-hp-table__field">
                            {hp +
                                $item.actor.system.abilities.con.check.mod +
                                hpData.hpBonusPerLevel}
                        </span>
                    {/if}
                {/each}

                <hr class="a5e-class-hp-table__rule" />

                <footer class="a5e-class-hp-table__footer">
                    <h3
                        class="a5e-class-hp-table__heading a5e-class-hp-table__heading--footer"
                    >
                        Other Bonuses
                    </h3>

                    <span class="a5e-class-hp-table__field">
                        {hpData.otherHpBonuses}
                    </span>

                    <h3
                        class="a5e-class-hp-table__heading a5e-class-hp-table__heading--footer"
                    >
                        Total HP
                    </h3>

                    <span
                        class="a5e-class-hp-table__field a5e-class-hp-table__field--total"
                    >
                        {hpData.totalHp}
                    </span>
                </footer>
            </div>
        </Section>
    {/if}

    <Section heading="Spell Casting" --a5e-section-body-gap="0.75rem">
        {#if !$item.parent}
            <RadioGroup
                heading="Default Spellcasting Ability"
                options={Object.entries(abilities)}
                selected={$item.system.spellcasting.ability.base}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.ability.options",
                        [],
                    );

                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.ability.base",
                        detail,
                    );
                }}
            />

            <CheckboxGroup
                heading="Optional Spellcasting Abilities"
                options={Object.entries(abilitiesWithoutNone)}
                selected={$item.system.spellcasting.ability.options}
                on:updateSelection={({ detail }) => {
                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.ability.base",
                        "none",
                    );

                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.ability.options",
                        detail,
                    );
                }}
            />
        {/if}

        {#if $item.parent}
            <RadioGroup
                heading="Spellcasting Ability"
                options={Object.entries(abilities)}
                selected={$item.system.spellcasting.ability.value}
                on:updateSelection={({ detail }) =>
                    updateDocumentDataFromField(
                        $item,
                        "system.spellcasting.ability.value",
                        detail,
                    )}
            />
        {/if}

        <RadioGroup
            heading="Caster Type"
            options={Object.entries(casterTypes)}
            selected={$item.system.spellcasting.casterType}
            on:updateSelection={({ detail }) =>
                updateDocumentDataFromField(
                    $item,
                    "system.spellcasting.casterType",
                    detail,
                )}
        />
    </Section>

    <Section heading="Wealth" --a5e-section-body-gap="0.75rem">
        <FieldWrapper hint="Enter a number value or a roll formula">
            <input
                type="text"
                value={$item.system.wealth}
                on:change={({ target }) =>
                    updateDocumentDataFromField($item, "system.wealth", target.value)}
            />
        </FieldWrapper>
    </Section>
</article>

<style lang="scss">
    .a5e-class-hp-table {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        align-items: center;
        gap: 0rem;
        margin-bottom: -0.375rem;
        font-family: var(--a5e-font-serif);

        &__field,
        &__field[type] {
            background: transparent;
            border: 0;
            text-align: center;
            width: 100%;

            &:focus {
                box-shadow: none;
            }
        }

        &__field--total {
            font-weight: 700;
        }

        &__footer,
        &__header {
            display: contents;
            font-size: var(--a5e-font-size-sm);
        }

        &__header {
            text-align: center;
        }

        &__heading {
            font-size: inherit;

            &--footer {
                padding-block: 0.25rem;
                grid-column: span 4;
                text-align: right;
            }
        }

        &__rule {
            width: 100%;
            grid-column: span 5;
            margin-block: 0.25rem;
            border: 0.5px solid #ccc;
        }
    }

    .slug-reset-button {
        background: none;
        border: 0;
        padding: 0;
        width: fit-content;
        height: fit-content;
        color: rgba(0 0 0 / 0.2);
        transition: var(--a5e-transition-standard);

        &:hover,
        &:focus {
            box-shadow: none;
            transform: scale(1.2);
            color: rgba(0 0 0 / 1);
        }
    }

    .slug-input {
        width: 95%;
    }
</style>
