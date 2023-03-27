const itemMappings = {
  feature: createFeature,
  maneuver: createManuever,
  object: createObject,
  spell: createSpell
};

export default async function createItem(actor, itemType, subType) {
  const updateData = {
    name: `New ${subType.capitalize()}`,
    type: itemType,
    system: itemMappings[itemType](subType)
  };

  await actor.createEmbeddedDocuments('Item', [updateData]);
}

function createFeature(type) {
  return {
    featureType: type
  };
}

function createManuever(type) {
  const system = {
    degree: Number(type)
  };

  // Add Exertion Consumer
  const actions = {
    [foundry.utils.randomID()]: {
      name: 'Execute',
      consumers: {
        [foundry.utils.randomID()]: {
          resource: 'exertion',
          quantity: 1,
          type: 'resource'
        }
      }
    }
  };

  system.actions = actions;
  return system;
}

function createObject(type) {
  return {
    objectType: type
  };
}

function createSpell(type) { }
