export interface JwtPayload {
    usuarioId: string;
    username: string;
    iat: number;
    exp: number;
    roles: string[];    
  }
