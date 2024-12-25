import { THttpMethod } from "../types/http-method";

const HTTP_METHOD: Record<string, THttpMethod> = {
  GET: 'get',
  POST: 'post',
  PUT: 'put',
  DELETE: 'delete',
  PATCH: 'patch',
}

export default HTTP_METHOD;