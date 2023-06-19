export function getClientPrincipal(req) {
  try {
    const header = req.headers['x-ms-client-principal'];
    const encoded = Buffer.from(header, 'base64');
    const decoded = encoded.toString('ascii');
    return JSON.parse(decoded);
  } catch (error) {
    return {};
  }
}

export function getOperationIdOverride(context) {
  return {
    'ai.operation.id': context.traceContext.traceparent,
  };
}

export default { getClientPrincipal, getOperationIdOverride };
