
export const postroutes: Record<string, () => void> = {
  '/dothing': dothing,
  '/dothingtoo': dothingtoo
};

export function dothing() {
  console.log("did thing");
  return;
}
export function dothingtoo() {
  console.log("did thing too electric boogaloo");
  return;
}
