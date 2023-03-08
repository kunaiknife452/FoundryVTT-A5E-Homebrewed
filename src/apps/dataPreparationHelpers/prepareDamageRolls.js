export default function prepareDamageRolls(rolls) {
  const counts = {};
  const damageRolls = Object.entries(rolls).filter(([_, roll]) => roll.type === 'damage');

  if (!damageRolls.length) return [];

  return damageRolls.map(([key, roll]) => {
    if (roll.label) return roll.label;

    const label = game.i18n.format('A5E.DamageSpecific', {
      damageType: game.i18n.localize(CONFIG.A5E.damageTypes[roll.damageType] ?? '')
    });

    counts[roll.damageType] ??= 0;
    counts[roll.damageType] += 1;

    return [key, `${label} #${counts[roll.damageType]}`];
  });
}
