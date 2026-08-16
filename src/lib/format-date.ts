// `releaseDate` is stored ISO (YYYY-MM-DD) so it sorts correctly as a plain
// string. Format it for display with a plain string split, not `new Date()`
// — parsing and reformatting would just reintroduce the locale/timezone
// inconsistency the ISO storage format exists to avoid.
export function formatReleaseDate(iso: string): string {
  const [year, month, day] = iso.split("-");
  return `${day}-${month}-${year}`;
}
