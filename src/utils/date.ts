export function formatIsoToDate(dateString: string) {
  const date = new Date(dateString);
  return date.toISOString().split('T')[0];
}

export function formatIsoToReadable(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('fr-FR');
}
