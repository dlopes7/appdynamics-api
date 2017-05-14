"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rp = require("request-promise");
const util = require("util");
const dotenv = require("dotenv");
dotenv.config();
let i = 0;
class AppDynamicsApi {
    constructor(controller, user, password, tenant) {
        this.controllerUrl = controller;
        this.user = user + '@' + (tenant || 'customer1');
        this.password = password;
        this.metricHierarchy = { name: 'root', type: 'folder', children: [] };
    }
    makeRequest(uri, qs) {
        if (qs == null) {
            qs = {};
        }
        qs.output = 'json';
        const options = {
            method: 'GET',
            url: this.controllerUrl + uri,
            qs,
            json: true,
            auth: {
                user: this.user,
                password: this.password
            }
        };
        //console.log(`Making request ${util.inspect(options)}`);
        return rp(options)
            .then((res) => {
            //console.log(res);
            return res;
        })
            .catch((err) => {
            console.log(`ERROR! ${err}`);
        });
    }
    // Application API
    getBusinessApplications() {
        const uri = '/controller/rest/applications';
        return this.makeRequest(uri)
            .then((apps) => {
            return apps;
        })
            .catch((err) => {
            console.log(`ERROR: ${err}`);
        });
    }
    getBusinessTransactions(app) {
        let uri = '/controller/rest/applications/%s/business-transactions';
        let appID = null;
        if (typeof app === 'object') {
            appID = app.id;
        }
        else {
            appID = app;
        }
        uri = util.format(uri, appID);
        return this.makeRequest(uri).then((bts) => {
            return bts;
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });
    }
    getTiers(app) {
        let uri = '/controller/rest/applications/%s/tiers';
        let appID = null;
        if (typeof app === 'object') {
            appID = app.id;
        }
        else {
            appID = app;
        }
        uri = util.format(uri, appID);
        return this.makeRequest(uri).then((tiers) => {
            return tiers;
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });
    }
    getTier(app, tier) {
        let uri = '/controller/rest/applications/%s/tiers/%s';
        let appID = null;
        let tierID = null;
        if (typeof app === 'object') {
            appID = app.id;
        }
        else {
            appID = app;
        }
        if (typeof tier === 'object') {
            tierID = tier.id;
        }
        else {
            tierID = tier;
        }
        uri = util.format(uri, appID, tierID);
        return this.makeRequest(uri).then((tiers) => {
            return (tiers.length > 0) ? tiers[0] : null;
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });
    }
    getBackends(app) {
        let uri = '/controller/rest/applications/%s/backends';
        let appID = null;
        if (typeof app === 'object') {
            appID = app.id;
        }
        else {
            appID = app;
        }
        uri = util.format(uri, appID);
        return this.makeRequest(uri).then((backends) => {
            return backends;
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });
    }
    getNodes(app) {
        let uri = '/controller/rest/applications/%s/nodes';
        let appID = null;
        if (typeof app === 'object') {
            appID = app.id;
        }
        else {
            appID = app;
        }
        uri = util.format(uri, appID);
        return this.makeRequest(uri).then((nodes) => {
            return nodes;
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });
    }
    getNode(app, node) {
        let uri = '/controller/rest/applications/%s/nodes/%s';
        let appID = null;
        let nodeID = null;
        if (typeof app === 'object') {
            appID = app.id;
        }
        else {
            appID = app;
        }
        if (typeof node === 'object') {
            nodeID = node.id;
        }
        else {
            nodeID = node;
        }
        uri = util.format(uri, appID, nodeID);
        return this.makeRequest(uri).then((nodes) => {
            return (nodes.length > 0) ? nodes[0] : null;
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });
    }
    getNodesInTier(app, tier) {
        let uri = '/controller/rest/applications/%s/tiers/%s/nodes';
        let appID = null;
        let tierID = null;
        if (typeof app === 'object') {
            appID = app.id;
        }
        else {
            appID = app;
        }
        if (typeof tier === 'object') {
            tierID = tier.id;
        }
        else {
            tierID = tier;
        }
        uri = util.format(uri, appID, tierID);
        return this.makeRequest(uri).then((nodes) => {
            return nodes;
        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });
    }
    // Metrics API
    buildMetricHierarchy(path) {
        const arrayNodes = path.split('|');
    }
    getMetricHierarchy(app, metricPath) {
        let uri = '/controller/rest/applications/%s/metrics';
        let appID = null;
        if (typeof app === 'object') {
            appID = app.id;
        }
        else {
            appID = app;
        }
        if (metricPath == null) {
            metricPath = '';
        }
        else {
            metricPath += '|';
        }
        // console.log('Processing ' + metricPath);
        uri = util.format(uri, appID);
        return this.makeRequest(uri, { 'metric-path': metricPath })
            .then((metrics) => {
            metrics.forEach((metric) => {
                const fullPath = metricPath + metric.name;
                if (metric.type === 'folder' && fullPath.startsWith('Application Infrastructure Performance')) {
                    return this.getMetricHierarchy(app, fullPath).
                        then((children) => {
                        //console.log(`Children of ${metric.name}: ${children}`);
                        metric.children = children;
                    });
                }
                else {
                    console.log(fullPath);
                    this.buildMetricHierarchy(fullPath);
                }
            });
            return metrics;
        });
    }
}
exports.AppDynamicsApi = AppDynamicsApi;
// const controller = process.env.CONTROLLER_HOST;
// const user = process.env.CONTROLLER_USER;
// const pass = process.env.CONTROLLER_PASSWORD;
// const tenant = process.env.CONTROLLER_TENANT;
// const appD = new AppDynamicsApi(controller, user, pass, tenant);
// appD.getBusinessApplications().then((apps) => {
//     if (apps.length > 0) {
//         appD.getMetricHierarchy(apps[0]).then((metricHierarchy) => {
//             console.log('\nGOT THEM');
//             console.log(metricHierarchy);
//             console.log('END\n');
//         });
//     }
// });
