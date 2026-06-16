import * as http from 'http';

export const getroutes: Record<string,any> = {
  'getest': get_test
};
function get_test(req: http.IncomingMessage, res: http.ServerResponse) {
  console.log("get thing test completed")
  return;
}
