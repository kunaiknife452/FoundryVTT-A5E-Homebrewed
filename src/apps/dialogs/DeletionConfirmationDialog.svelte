<script>
    import { getContext } from "svelte";

    import Checkbox from "../components/Checkbox.svelte";
    import FieldWrapper from "../components/FieldWrapper.svelte";

    export let { dialog, itemDocument, hideDeleteSection } =
        getContext("#external").application;

    function onSubmit() {
        dialog.submit({ confirmDeletion: true, hideDeleteConfirmation });
    }

    function onCancelDeletion() {
        dialog.submit({ confirmDeletion: false });
    }

    let hideDeleteConfirmation = game.settings.get(
        "a5e",
        "hideDeleteConfirmation",
    );
</script>

<form>
    {#if !hideDeleteSection}
        <FieldWrapper
            hint="You can reenable this dialog at any time by turning off the 'Hide Deletion Confirmation Dialog' system setting."
        >
            <Checkbox
                label="Don't show this dialog again"
                checked={hideDeleteConfirmation}
                on:updateSelection={({ detail }) => {
                    hideDeleteConfirmation = detail;
                }}
            />
        </FieldWrapper>
    {/if}

    <div class="button-container">
        <button on:click|preventDefault={() => onSubmit()}>
            <i class="fa-solid fa-trash" />
            {`Delete ${itemDocument.type.capitalize()}`}
        </button>

        <button on:click|preventDefault={() => onCancelDeletion()}>
            <i class="fa-solid fa-ban" />
            Cancel Deletion
        </button>
    </div>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        padding: 0.75rem;
    }

    .button-container {
        display: flex;
        gap: 0.5rem;
    }
</style>
