<script>
    import { createEventDispatcher } from "svelte";

    import FieldWrapper from "../FieldWrapper.svelte";
    import MultiStateCheckBoxGroup from "../MultiStateCheckBoxGroup.svelte";

    export let filterKey;
    export let filterSelections;
    export let heading;
    export let options;

    const dispatch = createEventDispatcher();
</script>

<FieldWrapper>
    <header class="a5efc-filter-header">
        <h3 class="a5efc-filter-heading">{heading}</h3>

        <div class="a5efc-filter-mode-button-wrapper">
            <button
                class="a5efc-filter-mode-button a5efc-filter-mode-button--inclusive"
                data-tooltip="Toggle Inclusive Filter Mode"
                data-tooltip-direction="UP"
                on:click={() =>
                    dispatch(
                        "updateInclusiveMode",
                        !filterSelections[filterKey].inclusiveMode == 1,
                    )}
            >
                {filterSelections[filterKey].inclusiveMode == 1 ? "AND" : "OR"}
            </button>

            <button
                class="a5efc-filter-mode-button a5efc-filter-mode-button--exclusive"
                data-tooltip="Toggle Exclusive Filter Mode"
                data-tooltip-direction="UP"
                on:click={() =>
                    dispatch(
                        "updateExclusiveMode",
                        !filterSelections[filterKey].exclusiveMode == 1,
                    )}
            >
                {filterSelections[filterKey].exclusiveMode == 1 ? "AND" : "OR"}
            </button>
        </div>
    </header>

    <MultiStateCheckBoxGroup
        color="red"
        options={Object.entries(options)}
        selected={[
            filterSelections[filterKey].inclusive,
            filterSelections[filterKey].exclusive,
        ]}
        on:updateSelection
    />
</FieldWrapper>

<style lang="scss">
    .a5efc-filter-heading {
        flex-shrink: 0;
        margin: 0;
        font-size: var(--a5e-text-size-sm);
        font-weight: bold;
        border-bottom: 0;
    }

    .a5efc-filter-header {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-bottom: 0.125rem;
    }

    .a5efc-filter-mode-button {
        justify-self: flex-end;
        width: fit-content;
        margin: 0;
        padding: 0.125rem 0.5rem;
        font-size: var(--a5e-text-size-xs);
        font-weight: bold;
        line-height: 1;
        background: transparent;

        &:hover,
        &:focus {
            box-shadow: none;
        }

        &--exclusive {
            color: var(--a5e-color-error);
            border-left: 0;
            border-radius: 0 3px 3px 0;
        }

        &--inclusive {
            color: var(--a5e-color-primary);
            border-right: 1px solid #b5b3a4;
            border-radius: 3px 0 0 3px;
        }
    }

    .a5efc-filter-mode-button-wrapper {
        display: flex;
    }
</style>
