import { FastifyRequest, FastifyReply } from 'fastify';
import { httpRequestDurationMicroseconds } from '../metrics/metrics';

export const onResponseHook = (request: FastifyRequest, reply: FastifyReply, done: () => void) => {
    const startTime = (request as any).startTime;
    if (startTime) {
        const responseTime = Date.now() - startTime;
        httpRequestDurationMicroseconds
            .labels(request.method, request.url || '', String(reply.statusCode))
            .observe(responseTime);
    }
    done();
};
