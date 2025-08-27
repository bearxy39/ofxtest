import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse, parseInput } from './lib/apigateway';
import { createPayment, Payment } from './lib/payments';
import { v4 as uuidv4 } from 'uuid';

const isValidCurrencyCode = (code: string): boolean => {
    if (!code) return false;
    try {
        new Intl.NumberFormat('en', { style: 'currency', currency: code });
        return true;
    } catch {
        return false;
    }
};

const hasAtMostTwoDecimals = (n: number): boolean => {
    return Number.isInteger(n * 100);
};

const isValidPayment = (payment: Payment): boolean => {
    if (!payment?.amount || payment?.amount <= 0 || !hasAtMostTwoDecimals(payment?.amount)) return false;
    if (!isValidCurrencyCode(payment?.currency)) return false;
    return true;
};

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payload = parseInput(event.body || '{}') as Payment;
    if(!isValidPayment(payload)) {
        return buildResponse(422, { error: 'Invalid payment' });
    }

    const payment = { ...payload, id: uuidv4() }    
    await createPayment(payment);
    return buildResponse(201, { id: payment.id });
};
