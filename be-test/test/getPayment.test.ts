import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { handler } from '../src/getPayment';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('When the user requests the records for a specific payment', () => {
    it('Returns the payment matching their input parameter.', async () => {
        const paymentId = randomUUID();
        const mockPayment = {
            id: paymentId,
            currency: 'AUD',
            amount: 2000,
        };
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(mockPayment);

        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual(mockPayment);

        expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
    });
});

describe('When the user requests the records for a not-existing payment', () => {
    it('Response 404 and error.', async () => {
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);
        const paymentId = randomUUID();

        const result = await handler({
            pathParameters: {
                id: paymentId,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(404);
        expect(JSON.parse(result.body)).toEqual({ error: 'Payment not found with the payment id' });

        expect(getPaymentMock).toHaveBeenCalledWith(paymentId);
    });
});

describe('When the user requests the records for an invalid payment id', () => {
    it('Response 400 and error.', async () => {
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);
        const result = await handler({
            pathParameters: {
                id: "invalid-id",
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ error: 'Invalid payment id' });

        expect(getPaymentMock).toHaveBeenCalledTimes(0);
    });
});

describe('When the user requests the records without payment id', () => {
    it('Response 400 and error.', async () => {
        const getPaymentMock = jest.spyOn(payments, 'getPayment').mockResolvedValueOnce(null);
        const result = await handler({
            pathParameters: {
                id: null,
            },
        } as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ error: 'Missing payment id.' });

        expect(getPaymentMock).toHaveBeenCalledTimes(0);
    });
});

afterEach(() => {
    jest.resetAllMocks();
});
