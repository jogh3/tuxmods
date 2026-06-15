
export const getroutes: Record<string, () => void> = {
  '/getest': get_test
};
function get_test() {
  console.log("get thing test completed")
  return;
}
