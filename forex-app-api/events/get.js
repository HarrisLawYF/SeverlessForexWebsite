import { success, failure } from "../libs/response-lib";
import { calculateMaximumProfit } from "../libs/bellman-ford-lib";
import { currency_data } from "../resources/currency.json";
export async function main(event, content, callback){
    //const data = JSON.parse(event.body);


    try{
        var body = {};
        body.total_currencies = 3;
        body.total_rates = 6;
        body.currencies = currency_data;
        var result = await calculateMaximumProfit(body);
        return success(result);
    } catch (e){
        console.log(e);
        return failure({status:false});
    }
}