import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { buildResponse } from './lib/apigateway';
import { listPayments } from './lib/payments';
import { isValidCurrencyCode } from './lib/utils';

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const currency = event.pathParameters?.currency;

    if (currency && !isValidCurrencyCode(currency)) {
        return buildResponse(400, { error: 'Invalid currency code' });
    }

    const payments = await listPayments(currency);
    return buildResponse(200, { data: payments });
};
