<script>
    import { localize } from "#runtime/svelte/helper";

    import updateAssociatedValues from "../../handlers/updateAssociatedValues";

    export let action;
    export let actionId;
    export let item;
    export let key;
    export let name;

    const A5E = CONFIG.A5E;

    function removeArea() {
        $item.update({
            [`system.actions.${actionId}.area`]: {
                "-=width": null,
                "-=radius": null,
                "-=height": null,
                "-=length": null,
            },
        });
    }
</script>

<input
    class="area-shape__input"
    id="area-{actionId}-{key}"
    name="{actionId}-area-shape"
    value={key}
    type="radio"
    checked={action?.area?.shape === key}
    on:click={({ target }) => {
        removeArea();

        updateAssociatedValues(
            $item,
            `system.actions.${actionId}.area.shape`,
            target.value,
            `system.actions.${actionId}.area.quantity`,
        );
    }}
/>

<label class="area-shape__label" for="area-{actionId}-{key}">
    <span class="u-text-sm">
        {@html A5E.areaIcons[key]}
    </span>

    {localize(name)}
</label>

<style lang="scss">
    .area-shape {
        &__input {
            display: none;

            &:checked + .area-shape__label {
                background: var(--a5e-color-primary);
                border-color: darken-color(var(--a5e-color-primary), 5);
                box-shadow: 0 0 10px darken-color(var(--a5e-color-primary), 10) inset;
                color: var(--a5e-color-text-light);

                &:hover {
                    background: var(--a5e-color-primary);
                }
            }
        }

        &__label {
            display: flex;
            align-items: center;
            flex-grow: 1;
            gap: 0.5rem;
            border-radius: var(--a5e-border-radius-standard);
            border: 1px solid #bbb;
            font-size: var(--a5e-text-size-sm);
            padding: 0.375rem 0.5rem;
            cursor: pointer;
            transition: var(--a5e-transition-standard);

            &:hover {
                background-color: rgba(0, 0, 0, 0.1);
            }
        }
    }
</style>
