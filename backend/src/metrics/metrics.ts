import client from 'prom-client';

if (!client.register.getSingleMetric('process_cpu_user_seconds_total')) {
    client.collectDefaultMetrics({ register: client.register });
}

// Defina as métricas customizadas
const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duração das requisições HTTP em milissegundos',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [50, 100, 200, 300, 400, 500, 1000],
});

export { client, httpRequestDurationMicroseconds };
