class AuthMiddleware{

Auth(req:Express.Request, res:Express.Response, next:any) {

    next();
  };
}
export default new AuthMiddleware().Auth;