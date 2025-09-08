export interface User {
  username: string;
  token: string;
  photoUrl?: string; // potrebbe essere nullo
  knownAs?: string;
  gender?: string;
}
