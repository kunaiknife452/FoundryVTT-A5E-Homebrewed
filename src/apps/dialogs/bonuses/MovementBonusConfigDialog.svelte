<script>
    import { getContext, createEventDispatcher } from "svelte";
    import { localize } from "#runtime/svelte/helper";

    import updateDocumentDataFromField from "../../../utils/updateDocumentDataFromField";

    import Checkbox from "../../components/Checkbox.svelte";
    import CheckboxGroup from "../../components/CheckboxGroup.svelte";
    import FieldWrapper from "../../components/FieldWrapper.svelte";
    import Section from "../../components/Section.svelte";

    export let { document, bonusID } = getContext("#external").application;
    export let jsonValue = null;

    const actor = document;
    const dispatch = createEventDispatcher();

    function updateImage() {
        const current = movementBonus?.img;

        const filePicker = new FilePicker({
            type: "image",
            current,
            callback: (path) => {
                onUpdateValue("img", path);
            },
        });

        return filePicker.browse();
    }

    function onUpdateValue(key, value) {
        if (jsonValue === null) {
            key = `system.bonuses.movement.${bonusID}.${key}`;
            updateDocumentDataFromField($actor, key, value);
            return;
        }

        const newObj = foundry.utils.expandObject({
            ...movementBonus,
            [key]: value,
        });
        dispatch("change", JSON.stringify(newObj));
    }

    function getMovementBonus() {
        if (jsonValue === null) return $actor.system.bonuses.movement[bonusID];

        try {
            const obj = JSON.parse(jsonValue || '""') ?? {};
            if (typeof obj !== "object") throw new Error();
            obj.label = obj.label ?? "";
            obj.unit = obj.unit || "feet";
            obj.formula = obj.formula ?? "";
            obj.context = obj.context ?? {
                movementTypes: [],
                isHover: false,
                // valueIfOriginalIsZero: "",
            };
            obj.img = obj.img || "icons/svg/upgrade.svg";
            return obj;
        } catch (error) {
            return {
                label: "",
                formula: "",
                unit: "feet",
                damageType: "",
                context: {
                    movementTypes: [],
                    isHover: false,
                    // valueIfOriginalIsZero: "",
                },
                default: true,
                img: "icons/svg/upgrade.svg",
            };
        }
    }

    const { movement, distanceUnits } = CONFIG.A5E;

    $: movementBonus = getMovementBonus($actor, jsonValue) ?? {};
    $: movementTypes = movementBonus.context.movementTypes ?? [];
    $: isHover = movementBonus.context.isHover ?? false;
    // $: valueIfOriginalIsZero =
    //     movementBonus.context.valueIfOriginalIsZero || "";
</script>

<form>
    <header class="sheet-header">
        <!-- svelte-ignore a11y-click-events-have-key-events -->
        <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
        <img
            class="bonus-image"
            src={movementBonus.img}
            alt={movementBonus.label}
            on:click={() => updateImage()}
        />

        <div class="name-wrapper">
            <input
                type="text"
                name="name"
                value={movementBonus.label ?? ""}
                class="bonus-name"
                placeholder="Bonus Name"
                on:change={({ target }) => onUpdateValue("label", target.value)}
            />
        </div>
    </header>

    <Section --a5e-section-body-direction="row" --a5e-section-margin="0.25rem 0">
        <FieldWrapper heading="A5E.Formula" --a5e-field-wrapper-grow="1">
            <input
                type="text"
                value={movementBonus.formula ?? ""}
                on:change={({ target }) => onUpdateValue("formula", target.value)}
            />
        </FieldWrapper>

        <FieldWrapper
            heading="A5E.Unit"
            --background="none"
            --direction="column"
            --padding="0"
        >
            <select
                class="u-w-fit damage-type-select"
                on:change={({ target }) => onUpdateValue("unit", target.value)}
            >
                <option
                    value={null}
                    selected={movementBonus.unit === "null" ||
                        movementBonus.unit === null}
                >
                    {localize("A5E.None")}
                </option>

                {#each Object.entries(distanceUnits) as [key, name] (key)}
                    <option value={key} selected={movementBonus.unit === key}>
                        {localize(name)}
                    </option>
                {/each}
            </select>
        </FieldWrapper>
    </Section>

    <Section
        heading="Contexts"
        hint="The context determines when the ability bonus applies"
        --a5e-section-body-gap="0.75rem"
    >
        <CheckboxGroup
            heading="A5E.contexts.movementTypes"
            options={Object.entries(movement)}
            selected={movementTypes}
            showToggleAllButton={true}
            on:updateSelection={({ detail }) => {
                onUpdateValue("context.movementTypes", detail);
            }}
        />

        <FieldWrapper>
            <Checkbox
                label="Is Hover For Flying Speed"
                checked={isHover ?? true}
                on:updateSelection={({ detail }) => {
                    onUpdateValue("context.isHover", detail);
                }}
            />
        </FieldWrapper>

        <!-- <FieldWrapper heading="A5E.contexts.valueIfOriginalIsZero">
            <input
                type="text"
                value={valueIfOriginalIsZero || ""}
                on:change={({ target }) =>
                    onUpdateValue(
                        "context.valueIfOriginalIsZero",
                        target.value,
                    )}
            />
        </FieldWrapper> -->
    </Section>
</form>

<style lang="scss">
    form {
        display: flex;
        flex-direction: column;
        height: 100%;
        padding: var(--padding, 0.75rem);
        gap: 0.5rem;
        background: var(--background, $color-sheet-background);
    }

    .bonus-name,
    .bonus-name[type="text"] {
        font-family: $font-primary;
        font-size: var(--a5e-text-size-xxl);
        border: 0;
        background: transparent;
        text-overflow: ellipsis;

        &:active,
        &:focus {
            box-shadow: none;
        }
    }

    .bonus-image {
        width: 2rem;
        height: 2rem;
        border-radius: 4px;
        cursor: pointer;
    }

    .name-wrapper {
        width: 100%;
    }

    .sheet-header {
        display: flex;
        align-items: center;
    }
</style>
