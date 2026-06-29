import { LoadOrder } from './types';
import { createAction } from 'redux-act';
export const setPrefixOffset = createAction('7DTD_SET_PREFIX_OFFSET', (profile, offset) => ({ profile, offset }));
export const setUDF = createAction('7DTD_SET_UDF', (udf) => ({ udf }));
export const setPreviousLO = createAction('7DTD_SET_PREVIOUS_LO', (profile, previousLO) => ({ profile, previousLO }));
//# sourceMappingURL=actions.js.map