<svelte:options accessors={true} />

<script>
    import { localize } from "#runtime/svelte/helper";

    export let HUD;

    function handleStatusEffectAdd({ id, src }, options = {}) {
        HUD.object._addStatusEffect({ id, src }, options);
    }

    function handleStatusEffectRemove({ id, src }, options = {}) {
        HUD.object._removeStatusEffect({ id, src }, options);
    }

    const data = HUD.getData();
    const statusEffects = Object.values(data.statusEffects);
    const genericEffects = Object.values(data.genericConditions);
    const activeConditions = HUD.object._getActiveConditions();

    const subConditions = CONFIG.statusEffects.reduce((acc, c) => {
        if (!c?.statuses?.length) return acc;

        c.statuses.forEach((s) => {
            acc[s] ??= [];
            acc[s].push(c.id);
        });
        return acc;
    }, {});

    $: conditionImmunities =
        HUD?.object?.actor?.system?.traits?.conditionImmunities ?? [];

    const colors = {
        1: "#919f00",
        2: "#a09200",
        3: "#af8300",
        4: "#bd7100",
        5: "#cb5c00",
        6: "#d63f00",
        7: "#e00006",
    };

    $: conditionsFlowDirection = game.settings.get("a5e", "conditionFlowDirection");

    $: fatigue = HUD?.object?.actor?.system?.attributes?.fatigue ?? 0;
    $: strife = HUD?.object?.actor?.system?.attributes?.strife ?? 0;
</script>

<div
    class="status-effects-container"
    class:status-effects-container--column-flow={conditionsFlowDirection === "column"}
>
    {#each statusEffects as effect}
        {@const linked = subConditions[effect.id]?.some((c) =>
            activeConditions.includes(c),
        )}

        <button
            class="condition-container {effect.cssClass}"
            class:linked
            class:locked={conditionImmunities.includes(effect.id)}
            class:fatigue-counter={effect.id === "fatigue" && fatigue > 0}
            class:strife-counter={effect.id === "strife" && strife > 0}
            title={effect.title ?? ""}
            data-status-id={effect.id}
            disabled={conditionImmunities.includes(effect.id) || linked}
            on:click|preventDefault|stopPropagation={() => {
                if (linked) return;
                handleStatusEffectAdd(effect, { overlay: effect.isOverlay });
            }}
            on:auxclick|preventDefault|stopPropagation={() => {
                if (linked) return;
                handleStatusEffectRemove(effect, { overlay: effect.isOverlay });
            }}
        >
            <img
                class={effect.cssClass}
                src={effect.src}
                alt={effect.title ?? ""}
                title={effect.title ?? ""}
                data-status-id={effect.id}
            />
            <h3
                class="condition-title"
                style="--strife: '{strife}'; --fatigue: '{fatigue}'; --fatigue-col: {colors[
                    fatigue
                ]}; --strife-col: {colors[strife]}"
            >
                {effect.title}
            </h3>
        </button>
    {/each}
</div>

<hr class="a5e-rule" />

<div class="generic-effects-container">
    {#each genericEffects as effect}
        <button
            class="condition-container {effect.cssClass}"
            title={effect.title ?? ""}
            data-status-id={effect.id}
            on:click|preventDefault|stopPropagation={() => handleStatusEffectAdd(effect)}
            on:auxclick|preventDefault|stopPropagation={() =>
                handleStatusEffectRemove(effect)}
        >
            <img
                class={effect.cssClass}
                src={effect.src}
                alt={effect.title ?? ""}
                title={effect.title ?? ""}
                data-status-id={effect.id}
            />
        </button>
    {/each}
</div>

<button class="clear-all-conditions" on:click={HUD?._clearAllConditions.bind(HUD)}>
    <i class="fa-solid fa-octagon-xmark" />
    {localize("A5E.UIClearAll")}
</button>

<style lang="scss">
    .status-effects-container {
        display: grid;
        grid-template-columns: repeat(3, minmax(8em, 1fr));
        gap: 0.75rem;
        padding: 0.75rem;
        padding-bottom: 0.5rem;
        font-size: var(--a5e-text-size-lg);
        line-height: 1.2rem;
        text-align: left;
        width: max-content;

        .active {
            img,
            h3 {
                font-weight: bold;
                color: $color-primary-light;
                // filter: invert(62%) sepia(32%) saturate(6599%)
                //     hue-rotate(110deg) brightness(96%) contrast(83%);
            }
        }

        &--column-flow {
            grid-template-rows: repeat(8, 1fr);
            grid-auto-flow: column;
        }
    }

    .condition-container {
        display: flex;
        position: relative;
        background-color: transparent;
        gap: 0.5rem;
        font-size: var(--a5e-text-size-md);
        align-items: center;
        margin-block: 0.125rem;
        border: none;
        color: rgb(204 204 204);
        cursor: pointer;
        transition: var(--a5e-transition-standard);

        &:hover,
        &:focus {
            outline: none;
            box-shadow: none;
            color: $color-primary-light;
        }

        &:disabled {
            img,
            h3 {
                cursor: not-allowed;
                font-weight: bold;
                color: lighten-color(var(--a5e-color-warning), 15);
                // filter: invert(11%) sepia(42%) saturate(7092%)
                //     hue-rotate(352deg) brightness(94%) contrast(81%);
            }

            &:hover {
                color: rgb(204 204 204);
            }
        }

        &.linked,
        &.locked,
        &.fatigue-counter,
        &.strife-counter {
            h3::before {
                content: "\f0c1";
                font: var(--fa-font-solid);

                display: flex;
                align-items: center;
                justify-content: center;
                padding: 1px;

                background-color: rgba(0 0 0 / 0.45);
                border-radius: 50%;
                width: 1.25rem;
                aspect-ratio: 1/1;
                color: white;
                font-size: var(--a5e-text-size-sm);

                position: absolute;
                top: -0.75rem;
                left: 1.65rem;
            }
        }

        &.locked {
            h3::before {
                content: "\f023";
            }
        }

        &.fatigue-counter {
            h3::before {
                content: var(--fatigue);
                font-family: $font-secondary;
                font-size: var(--a5e-text-size-md);
                background-color: var(--fatigue-col);
            }
        }

        &.strife-counter {
            h3::before {
                content: var(--strife);
                font-family: $font-secondary;
                font-size: var(--a5e-text-size-md);
                background-color: var(--strife-col);
            }
        }

        h3 {
            height: 1rem;
            border: none;
        }

        img {
            width: 2rem;
            height: 2rem;
            margin: 0;
            padding: 0;
            border: none;
            opacity: 1;
        }
    }

    .generic-effects-container {
        display: flex;
        justify-content: space-around;
        padding-block-start: 0.375rem;
        padding-block-end: 0.75rem;

        .condition-container {
            justify-content: center;

            img {
                width: 2rem;
                aspect-ratio: 1/1;
                border: 2px solid black;
                border-radius: 50%;

                &:hover {
                    outline: 3px solid #ccc;
                }
            }
        }

        .active {
            img {
                border-radius: 50%;
                outline: 4px solid #ccc;
            }
        }
    }

    .clear-all-conditions {
        position: absolute;
        bottom: 100%;
        right: -1px;
        padding: 0.25em;
        color: rgb(204 204 204);
        border: none;
        border-radius: 4px 4px 0 0;
        background-color: black;
        font-size: 1.25rem;
        cursor: pointer;
        transition: var(--a5e-transition-standard);

        &:hover {
            color: lighten-color(var(--a5e-color-error), 15);
            box-shadow: none;
        }
    }
    // Generate filter
    // https://isotropic.co/tool/hex-color-to-css-filter/
</style>
