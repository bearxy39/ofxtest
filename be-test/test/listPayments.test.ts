import * as payments from '../src/lib/payments';
import { randomUUID } from 'crypto';
import { handler } from '../src/listPayments';
import { APIGatewayProxyEvent } from 'aws-lambda';

describe('When the user requests listing payment without currency', () => {
    it('Returns the payments without filtering currency.', async () => {
        const mockPayments = [{
            id: randomUUID(),
            currency: 'AUD',
            amount: 2000,
        }];
        const listPaymentMock = jest.spyOn(payments, 'listPayments').mockResolvedValueOnce(mockPayments);

        const result = await handler({} as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({data: mockPayments});

        expect(listPaymentMock).toHaveBeenCalledWith(undefined);
    });
});

describe('When the user requests listing payment with a vaid currency', () => {
    it('Returns the payments after filtering currency.', async () => {
        const mockPayments = [{
            id: randomUUID(),
            currency: 'AUD',
            amount: 2000,
        }];
        const listPaymentMock = jest.spyOn(payments, 'listPayments').mockResolvedValueOnce(mockPayments);

        const result = await handler({
            pathParameters: {
                currency: 'AUD',
            },} as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(200);
        expect(JSON.parse(result.body)).toEqual({data: mockPayments});

        expect(listPaymentMock).toHaveBeenCalledWith('AUD');
    });
});

describe('When the user requests listing payment with a bad currency', () => {
    it('Returns the payments after filtering currency.', async () => {
        const mockPayments = [{
            id: randomUUID(),
            currency: 'AUD',
            amount: 2000,
        }];
        const listPaymentMock = jest.spyOn(payments, 'listPayments').mockResolvedValueOnce(mockPayments);

        const result = await handler({
            pathParameters: {
                currency: 'XXXXX',
            },} as unknown as APIGatewayProxyEvent);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toEqual({ error: 'Invalid currency code' });

        expect(listPaymentMock).toHaveBeenCalledTimes(0);
    });
});

afterEach(() => {
    jest.resetAllMocks();
});
