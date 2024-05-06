import { getSession } from 'next-auth';

export async function authMiddleware(req, res, next) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Si deseas, puedes acceder a los datos del usuario desde `session.user`

  console.log('Usuario autenticado:', session.user);

  // Continuar con el siguiente middleware
  next();
}