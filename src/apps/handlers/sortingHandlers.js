export function sortAscending(document, reducer, documentName) {
  const entities = [...reducer];

  if (documentName === 'ActiveEffect') {
    entities.sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()));
  } else {
    entities.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }

  const updateData = entities.map((entity, idx) => (documentName === 'ActiveEffect'
    ? { _id: entity.id, flags: { a5e: { sort: idx } } }
    : { _id: entity.id, sort: idx }));

  document.updateEmbeddedDocuments(documentName, updateData);
}

export function sortDescending(document, reducer, documentName) {
  const entities = [...reducer];
  if (documentName === 'ActiveEffect') {
    entities
      .sort((a, b) => a.label.toLowerCase().localeCompare(b.label.toLowerCase()))
      .reverse();
  } else {
    entities
      .sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
      .reverse();
  }

  const updateData = entities.map((entity, idx) => (documentName === 'ActiveEffect'
    ? { _id: entity.id, flags: { a5e: { sort: idx } } }
    : { _id: entity.id, sort: idx }));

  document.updateEmbeddedDocuments(documentName, updateData);
}
