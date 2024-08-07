<script>
    import { getContext } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import DeletionConfirmationDialog from "../dialogs/initializers/DeletionConfirmationDialog";

    export let effect;

    function onEffectActivate() {}

    function onConfigure() {
        effect.sheet?.render(true);
    }

    function onDuplicate() {
        effect.duplicateEffect();
    }

    async function onDelete() {
        let dialogData;

        if (!game.settings.get("a5e", "hideDeleteConfirmation")) {
            const itemDocument = { name: effect.name, type: "Active Effect" };
            const dialog = new DeletionConfirmationDialog(itemDocument);
            await dialog.render(true);
            dialogData = await dialog.promise;

            if (!dialogData || !dialogData.confirmDeletion) return;
        }

        await game.settings.set(
            "a5e",
            "hideDeleteConfirmation",
            dialogData?.hideDeleteConfirmation ??
                game.settings.get("a5e", "hideDeleteConfirmation"),
        );

        const effectId = effect.id;
        effect.delete();

        // Remove Prompt config
        if (!actionId || $doc.documentName !== "Item") return;

        const action = $doc.system.actions[actionId];
        const prompt = Object.entries(action?.prompts ?? {}).find(
            ([, prompt]) => prompt.type === "effect" && prompt.effectId === effectId,
        );

        if (!prompt?.[0]) return;

        $doc.update({
            [`system.actions.${actionId}.prompts.-=${prompt[0]}`]: null,
        });
    }

    function onDragStart(event) {
        const dragData = effect.toDragData();
        if (!dragData) return;

        dragData.parentId = effect?.parent?.id;

        return event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }

    const doc = getContext("actor") ?? getContext("item");
    const actionId = getContext("actionId");

    let rightClickConfigure =
        game.settings.get("a5e", "itemRightClickConfigure") ?? false;

    $: allowTransfer =
        effect.getFlag("a5e", "transferType") === "passive" &&
        $doc.documentName === "Item" &&
        ["Actor", "ActorDelta"].includes($doc.parent?.documentName);

    $: sheetIsLocked = !$doc.isOwner
        ? true
        : $doc.documentName === "Item"
          ? false
          : $doc.flags?.a5e?.sheetIsLocked ?? true;
</script>

<li
    class="a5e-item a5e-item--effect"
    draggable="true"
    on:dragstart={onDragStart}
    on:auxclick|preventDefault={() => {
        if (rightClickConfigure) onConfigure();
    }}
>
    <button
        class="effect-activate-button"
        class:disable-pointer-events={!$doc.isOwner}
        disabled={true}
        on:click|stopPropagation={({ target }) => {
            target.blur();
            onEffectActivate();
        }}
    >
        <img
            class="effect-image"
            src={effect?.img ?? doc.img ?? "icons/svg/aura.svg"}
            alt={effect?.name ?? localize("A5E.effects.new")}
        />
    </button>

    <div class="name-wrapper">
        <div class="name">
            {effect.name}
        </div>
    </div>

    <div class="indicator-wrapper">
        {#if effect.isTemporary}
            <div class="component-wrapper">
                <div
                    class="component"
                    data-tooltip="A5E.effects.types.singular.temporary"
                    data-tooltip-direction="UP"
                >
                    <i class="fa-solid fa-hourglass-half" />
                </div>
            </div>
        {/if}

        <div class="button-wrapper">
            {#if allowTransfer}
                <button
                    class="effect-button fa-regular fa-circle-down"
                    data-tooltip="A5E.effects.applyToActor"
                    data-tooltip-direction="UP"
                    on:click={() => effect.transferEffect($doc.parent)}
                />
            {/if}

            {#if $doc.documentName === "Actor"}
                <button
                    class="effect-button effect-button--active-toggle fas"
                    class:fa-toggle-off={effect.isSuppressed}
                    class:fa-toggle-on={!effect.isSuppressed}
                    class:active={!effect.isSuppressed}
                    class:locked={effect.isLocked}
                    data-tooltip={effect.isLocked
                        ? "Originating item is not equipped."
                        : "A5E.effects.toggleActiveState"}
                    data-tooltip-direction="UP"
                    on:click={() => effect.toggleActiveState()}
                />
            {/if}
        </div>
    </div>

    <!-- Summary -->

    {#if $doc.isOwner}
        {#if !sheetIsLocked}
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-no-static-element-interactions -->
            <div class="track" on:click|stopPropagation>
                <i class="track-icon fa-solid fa-ellipsis-vertical" />

                <ul class="track-items">
                    <li>
                        <button
                            class="action-button fas fa-cog"
                            data-tooltip="A5E.ButtonToolTipConfigure"
                            data-tooltip-direction="UP"
                            on:click|stopPropagation={onConfigure}
                        />
                    </li>

                    <li>
                        <button
                            class="action-button fa-solid fa-clone"
                            data-tooltip="A5E.ButtonToolTipDuplicate"
                            data-tooltip-direction="UP"
                            on:click|stopPropagation={onDuplicate}
                        />
                    </li>

                    <li>
                        <button
                            class="action-button delete-button fas fa-trash"
                            data-tooltip="A5E.ButtonToolTipDelete"
                            data-tooltip-direction="UP"
                            on:click|stopPropagation={onDelete}
                        />
                    </li>
                </ul>
            </div>
        {/if}
    {/if}
</li>

<style lang="scss">
    .disable-pointer-events {
        pointer-events: none;
    }

    .effect-activate-button {
        width: 1.5rem;
        height: 1.5rem;
        padding: 0;
        margin: 0;
        background: transparent;
        border-radius: var(--a5e-border-radius-standard);
        grid-area: icon;

        &:hover {
            box-shadow: none;
        }
    }

    .effect-image {
        display: block;
        height: 100%;
        width: auto;
    }

    .name-wrapper {
        display: flex;
        align-items: center;
        flex-grow: 0;
        gap: 0.5rem;
        overflow: hidden;
        grid-area: name;
    }

    .name {
        font-size: var(--a5e-text-size-sm);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .indicator-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
        margin-inline: 0.25rem;
        grid-area: indicators;
    }

    .button-wrapper,
    .component-wrapper {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-inline: 0.5rem 0.375rem;
    }

    .button-wrapper {
        margin-inline: 0.25rem;
        gap: 0.5rem;
    }

    .component-wrapper {
        gap: 0.5rem;
    }

    .component {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 1rem;
        width: 1rem;
        border-radius: var(--a5e-border-radius-standard);
        font-size: var(--a5e-text-size-sm);
        color: #808080;
    }

    .effect-button {
        flex-grow: 0;
        width: fit-content;
        padding: 0;
        margin: 0;
        background: none;
        color: #999;
        border: 0;
        font-size: var(--a5e-text-size-lg);
        transition: var(--a5e-transition-standard);

        &--active-toggle {
            font-size: var(--a5e-text-size-xl);
        }

        &:hover {
            color: var(--a5e-color-primary);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .active {
        color: var(--a5e-color-primary);
    }

    .locked {
        cursor: not-allowed;

        &:hover {
            color: #999;
        }
    }

    .action-button {
        padding: 0.25rem;
        color: #999;
        border: 0;
        background: none;

        // 17.5 pixels: the width of the largest icon we have
        min-width: 1.09375rem;

        transition: var(--a5e-transition-standard);

        &:hover {
            color: #555;
            transform: scale(1.2);
        }

        &:hover,
        &:focus {
            box-shadow: none;
        }
    }

    .delete-button:hover {
        color: var(--a5e-color-error);
    }

    .track {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        width: 1.5rem;
        height: 1.5rem;
        margin-inline: 0.5rem 0.5rem;
        border-radius: 50%;
        color: #999;
        grid-area: menu;

        transition: width 0.3s ease;

        &-icon {
            z-index: 1;
            display: flex;
            width: 1.5rem;
            height: 1.5rem;
            flex-shrink: 0;
            align-items: center;
            justify-content: center;
            border: 1px solid #ccc;
            background: #ebe9e0;
            border-radius: 50%;
            cursor: pointer;
            font-size: var(--a5e-text-size-md);
            transform: translateX(-1px);

            transition: var(--a5e-transition-standard);
        }

        &-items {
            z-index: 0;
            display: none;
            align-items: center;
            gap: 0.25rem;
            height: 1.5rem;
            padding: 0 1rem 0 0.5rem;
            border: 1px solid #ccc;
            border-left: 0;
            margin: 0;
            background: #ebe9e0;
            border-radius: 0.75rem 0 0 0.75rem;
            list-style: none;
            opacity: 0;
            transform: translateX(calc(-100% - 1rem));

            transition: var(--a5e-transition-standard);
        }

        &:hover {
            overflow: initial;

            .track-items {
                display: flex;
                opacity: 1;
            }

            .track-icon {
                color: #555;
            }
        }
    }
</style>
