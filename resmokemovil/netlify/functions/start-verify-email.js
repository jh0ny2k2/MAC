// Verificacion por email deshabilitada: se elimino el canal de correo (Resend).
// El endpoint responde 501 de forma explicita para no fallar en silencio.
exports.handler = async () => ({
  statusCode: 501,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    success: false,
    error: 'Verificacion por email no disponible: canal de correo eliminado'
  })
});
