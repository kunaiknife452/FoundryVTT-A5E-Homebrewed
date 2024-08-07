<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";
    import { TJSMenu, TJSIconButton, TJSToggleIconButton } from "#standard/component";
    import { createEventDispatcher } from "svelte";

    import createItem from "../../../utils/createItem";
    import createEffect from "../../../utils/createActiveEffect";

    export let documentName = "Item";
    export let menuList = [];
    export let offset = { x: 0, y: 0 };
    export let reducerType = null;
    export let reducer = null;
    export let options = {};
    export let entityTypeOverride = null;

    // Default createDocument
    function createDocument(entityType) {
        if (!entityType) entityType = entityTypeOverride;

        if (!["Item", "ActiveEffect"].includes(documentName))
            return dispatch("press", entityType);

        if (documentName === "Item" && $document.documentName === "Actor")
            return createItem($document, reducerType.slice(0, -1), entityType);

        if (documentName === "ActiveEffect") return createEffect($document, options);
    }

    const document = getContext("actor") ?? getContext("item");

    if (!reducer) {
        reducer = document[reducerType];
    }

    const dispatch = createEventDispatcher();
</script>

{#if menuList.length}
    <TJSToggleIconButton
        title="Add {documentName}"
        icon="fas fa-plus"
        --tjs-icon-button-background-hover="none"
        --tjs-icon-button-background-focus="none"
        --tjs-icon-button-background-focus-visible="none"
        --tjs-icon-button-background-selected="none"
        --tjs-icon-button-text-shadow-hover="none"
        --tjs-icon-button-text-shadow-focus="none"
        --tjs-icon-button-transition="var(--a5e-transition-standard)"
        --tjs-icon-button-diameter="1.1rem"
        --tjs-icon-button-border-radius="0"
    >
        <TJSMenu {offset}>
            <article>
                {#each menuList as [type, heading]}
                    <button on:click|preventDefault={() => createDocument(type)}>
                        {localize(heading)}
                    </button>
                {/each}
            </article>
        </TJSMenu>
    </TJSToggleIconButton>
{:else}
    <TJSIconButton
        title="Add {documentName}"
        icon="fas fa-plus"
        onPress={() => createDocument()}
        --tjs-icon-button-background-hover="none"
        --tjs-icon-button-background-focus="none"
        --tjs-icon-button-background-focus-visible="none"
        --tjs-icon-button-background-selected="none"
        --tjs-icon-button-text-shadow-hover="none"
        --tjs-icon-button-text-shadow-focus="none"
        --tjs-icon-button-transition="var(--a5e-transition-standard)"
        --tjs-icon-button-diameter="1rem"
        --tjs-icon-button-border-radius="0"
    />
{/if}

<style lang="scss">
    article {
        position: relative;
        display: grid;
        min-width: 15rem;

        grid-template-columns: repeat(3, minmax(max-content, 1fr));
        gap: 0.125rem;
        padding: 0.125rem 0.125rem;
        white-space: nowrap;
    }

    button {
        background: transparent;
        color: white;
        font-size: var(--a5e-text-size-xs);
    }
</style>
