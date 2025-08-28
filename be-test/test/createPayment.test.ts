import { randomUUID } from 'crypto';
import { handler } from '../src/createPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { validate as isValidUUID } from 'uuid';

let createdPayment: any; 
jest.mock('../src/lib/payments', () => {
    // Must match the exported members (including types, if needed)
    return {
        // For types, you might need to also re-export Payment type, or use typeof import
        __esModule: true, // if you're using ES modules
        createPayment: jest.fn(async (payment) => {
            createdPayment = payment;
        }),
    };
});
import * as payments from '../src/lib/payments';

describe('When the user create a new payment', () => {
    it('Returns 201 and the new payment id.', async () => {
        const mockPayment = {
            id: randomUUID(),
            currency: 'AUD',
            amount: 2000,
        };

        const result = await handler({
            body: JSON.stringify(mockPayment),
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(201);
        expect(isValidUUID(createdPayment?.id)).toBe(true);
        expect(createdPayment?.id).not.toBe(mockPayment.id);
        expect(JSON.parse(result.body)).toEqual({ id: createdPayment?.id });
        expect(payments.createPayment).toHaveBeenCalledTimes(1);
    });
});

describe('When the user create a new payment with an invalid currency code', () => {
    it('Returns 422 and error', async () => {
        const mockPayment = {
            id: randomUUID(),
            currency: 'XXXX',
            amount: 2000,
        };

        const result = await handler({
            body: JSON.stringify(mockPayment),
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({ error: 'Invalid payment' });
        expect(payments.createPayment).toHaveBeenCalledTimes(0);
    });
});

describe('When the user create a new payment with a zero amount', () => {
    it('Returns 422 and error', async () => {
        const mockPayment = {
            id: randomUUID(),
            currency: 'AUD',
            amount: -10,
        };

        const result = await handler({
            body: JSON.stringify(mockPayment),
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({ error: 'Invalid payment' });
        expect(payments.createPayment).toHaveBeenCalledTimes(0);
    });
});

describe('When the user create a new payment with a negative amount', () => {
    it('Returns 422 and error', async () => {
        const mockPayment = {
            id: randomUUID(),
            currency: 'AUD',
            amount: -10,
        };

        const result = await handler({
            body: JSON.stringify(mockPayment),
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({ error: 'Invalid payment' });
        expect(payments.createPayment).toHaveBeenCalledTimes(0);
    });
});

describe('When the user create a new payment with more than two decimal', () => {
    it('Returns 422 and error', async () => {
        const mockPayment = {
            id: randomUUID(),
            currency: 'AUD',
            amount: 10.14564,
        };

        const result = await handler({
            body: JSON.stringify(mockPayment),
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(422);
        expect(JSON.parse(result.body)).toEqual({ error: 'Invalid payment' });
        expect(payments.createPayment).toHaveBeenCalledTimes(0);
    });
});

afterEach(() => {
    jest.resetAllMocks();
});
