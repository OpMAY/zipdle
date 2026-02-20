export function getYouTubeId(url: string | undefined): string | null {
  if (!url) return null;

  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  return match && match[2].length === 11 ? match[2] : null;
}

export function translateRole(role: string): string {
  const map: Record<string, string> = {
    leader: "리더",
    member: "멤버",
    guest: "게스트",
  };
  return map[role.toLowerCase()] || role;
}

export function translatePart(part: string): string {
  const map: Record<string, string> = {
    vocal: "보컬",
    guitar: "기타",
    bass: "베이스",
    drums: "드럼",
    keyboard: "키보드",
  };
  return map[part.toLowerCase()] || part;
}
