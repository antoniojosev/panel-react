import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <section>
      <h2>404 - Página no encontrada</h2>
      <p>Regresa a <Link to="/">inicio</Link>.</p>
    </section>
  )
}
