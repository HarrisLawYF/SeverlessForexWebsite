import { getCurrencyRates } from "../libs/currency-data";
//const parallel = require("map-parallel");
var async = require("async");
//const os = require("os");

export async function calculateMaximumProfit(body) {
    return await generateCurrencyGraph(body);
}


var min = -9999999;

//This is like a virtual class
/*var edge = {
    id: 0,
    src_bank: 0,
    dest_bank: 0,
    rate: 0,
    extra_cost: 0
};*/

var graph = {
    edges:[],
    banks: 0,
    rates: 0,
    create: function(){
        for (var i = 0; i < this.rates; i++) {
            // Initialize the graph with empty nodes
            var new_edge = {src_bank:0,dest_bank:0};
            this.edges.push(new_edge);
        }
        return this;
    },
};

function calculateMoneyWithCurrencyRate(local_currency, rate, extra_cost){
    var result = local_currency * rate;
    result = result*((100-extra_cost)/100);
    return result;
}

function Forex(graph, src_bank)
{
    var V = graph.banks;
    var E = graph.rates;
    var dist = [];
    var bridges = [];

    // Step 1: Initialize distances from src to all other vertices as INFINITE negative
    for (var z = 0; z < V; ++z){
        dist[z] = min;
        bridges[z] = [src_bank];
    }

    //Start with 1 dollar
    dist[src_bank] = 1;

    for (var i = 1; i < 10; ++i) {
        for (var j = 0; j < E; ++j) {
            var u = graph.edges[j].src_bank;
            var v = graph.edges[j].dest_bank;
            var extra_cost = graph.edges[j].extra_cost;
            var rate = graph.edges[j].rate;
            var result = calculateMoneyWithCurrencyRate(dist[u],rate,extra_cost);
            if (dist[u] != min && result > dist[v]){
                dist[v] = result;
                var new_route = bridges[u].slice(0);
                bridges[v] = new_route;
                bridges[v].push(v);
            }
        }
    }
    //printArr(dist, bridges, V);
    graph.final_value = dist;
    graph.final_path = bridges;
    return graph;
}

// A utility function used to print the solution
/*function printArr(dist, bridges, V)
{
    console.log("Vertex Distance from Source");
    for (var i = 0; i < V; ++i){
        console.log(i + "\t\t" + dist[i]);
        console.log(bridges[i]);
        console.log("--------------");
    }

}*/

async function buildGraph(link,currency,position,callback){
    link.id = position;
    link.src_bank = currency[position].src_id;
    link.dest_bank = currency[position].dest_id;
    var rate = await getCurrencyRates(currency[position].src, currency[position].dest);
    link.rate = rate.rates[currency[position].dest];
    link.extra_cost = 0;

    return callback(null,link);
}

async function generateCurrencyGraph(data){
    var new_graph = {edges:[],banks:data.total_currencies,rates:data.total_rates};
    new_graph = graph.create.call(new_graph);

    const promise = new Promise(function(resolve, reject) {
        async.map(new_graph.edges, function(edge, callback) {
            buildGraph(edge,data.currencies,new_graph.edges.indexOf(edge),callback);
        }, function (err, results) {
            if (err){
                console.log(err);
            }
            new_graph.edges = results;
            var result = Forex(new_graph,0);
            if(result!=null){
                resolve(result);
            } else{
                reject("Maximum profit not calculated");
            }
        });
    });
    return promise;
}