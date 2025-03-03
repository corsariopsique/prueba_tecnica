/**
 * Interface que determina los campos de carga del token JWT
 * @interface JwtPayload
 */

export interface JwtPayload {
    usuarioId: string;
    username: string;
    iat: number;
    exp: number;
    roles: string[];    
  }
