import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from './lib/apigateway';
import { getPayment, Payment } from './lib/payments';
import { validate as isValidUUID } from 'uuid';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const paymentId = event.pathParameters?.id;

    if (!paymentId) {
        return buildResponse(400, { error: 'Missing payment id.' });
    }

    if(!isValidUUID(paymentId)) {
        return buildResponse(400, { error: 'Invalid payment id' });
    }

    const payment = await getPayment(paymentId);
    if (!payment) {
        return buildResponse(404, { error: 'Payment not found with the payment id' });
    }

    return buildResponse(200, payment);
};
