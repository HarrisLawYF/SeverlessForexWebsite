const AWS = require('aws-sdk');
export async function getCurrencyRates(source, dest) {
    // --------------- TCI Service Descriptor -----------------------
    // define target API as service
    const service = new AWS.Service({
        // TIBCO Cloud Integration base API URL,
        // can be even more secured using TIBCO Mashery.
        endpoint: "https://api.exchangeratesapi.io/",
        convertResponseTypes: false,

        // TCI Flogo API REST
        apiConfig: {
            metadata: {
                protocol: 'rest-json' // API is JSON-based
            },
            operations: {

                // TCI Flogo custom Endpoint
                // get Data by a record id
                getData: {
                    http: {
                        method: 'GET',
                        requestUri: "latest?base="+source+"&symbols="+dest+"&amount=1"
                    },
                    input: {
                        type: 'structure',
                        required: [ ]
                    }
                }
            }
        }
    });

    const promise = new Promise(function(resolve, reject) {
        service.isGlobalEndpoint = true;
        service.getData({}, (err, data) => {
            if (err) {
                console.error(':>> operation error:', err);
                reject(err);
            }
            resolve(data);
        });
    });
    return promise;
}