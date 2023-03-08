export default function prepareAbilityCheckPrompts(prompts) {
  const counts = {};

  if (!prompts.length) return [];

  return prompts.map(([key, prompt]) => {
    if (prompt.label) return prompt.label;

    const label = game.i18n.format('A5E.AbilityCheckSpecific', {
      ability: game.i18n.localize(CONFIG.A5E.abilities[prompt.ability])
    });

    counts[prompt.ability] ??= 0;
    counts[prompt.ability] += 1;

    return [key, `${label} #${counts[prompt.ability]}`];
  });
}
