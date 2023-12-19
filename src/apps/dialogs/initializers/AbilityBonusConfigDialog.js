import { TJSDocument } from '#runtime/svelte/store/fvtt/document';
import { TJSDialog } from '#runtime/svelte/application';

import AbilityBonusDialog from '../AbilityBonusConfigDialog.svelte';

/**
 * Provides a dialog for creating documents that by default is modal and not draggable.
 */
export default class AbilityBonusConfigDialog extends TJSDialog {
  constructor(actor, abilityBonusId, options = {}) {
    super({
      title: `${actor.name} Ability Bonus Configuration`,
      content: {
        class: AbilityBonusDialog,
        props: { actor: new TJSDocument(actor), abilityBonusId }
      },
      zIndex: null
    }, {
      id: `${actor.uuid}-abilities-bonus-config-dialog-${abilityBonusId}`,
      classes: ['a5e-sheet'],
      width: options.width ?? 432
    });

    // Add to dialogs
    game.a5e.dialogs.bonuses.abilities[abilityBonusId] = this;
  }
}
