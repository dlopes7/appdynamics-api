import * as rp from 'request-promise';
import * as request from 'request';
import * as util from 'util';
import * as dotenv from 'dotenv';
dotenv.config();

interface IApplication {
    id: number;
    name: string;
    description: string;
}

interface IBusinessTransaction {
    internalName: string;
    tierId: number;
    entryPointType: string;
    background: boolean;
    tierName: string;
    name: string;
    id: number;
}

interface ITier {
    agentType: string;
    name: string;
    description: string;
    id: number;
    numberOfNodes: number;
    type: string;
}

interface IBackend {
    exitPointType: string;
    tierId: number;
    name: string;
    applicationComponentNodeId: number;
    id: number;
    properties: object[];
}

interface INode {
    appAgentVersion: string;
    machineAgentVersion: number;
    agentType: string;
    type: number;
    id: number;
    machineName: string;
    appAgentPresent: boolean;
    nodeUniqueLocalId: string;
    machineId: number;
    machineOSType: string;
    tierId: number;
    tierName: string;
    machineAgentPresent: boolean;
    name: string;
    ipAddresses: object[];

}

interface IMetric {
    name: string;
    type: string;
    children: IMetric[];
}


let i = 0;
export class AppDynamicsApi {


    private controllerUrl: string;
    private user: string;
    private password: string;
    private metricHierarchy: IMetric;

    constructor(controller: string, user: string, password: string, tenant?: string) {
        this.controllerUrl = controller;

        this.user = user + '@' + (tenant || 'customer1');
        this.password = password;
        this.metricHierarchy = { name: 'root', type: 'folder', children: [] };

    }

    makeRequest(uri, qs?, jar?) {

        if (qs == null) {
            qs = {};
        }
        if (jar == null) {
            jar = {};
        }

        qs.output = 'json';
        const options = {
            method: 'GET',
            url: this.controllerUrl + uri,
            qs,
            jar,
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
            .then((apps: IApplication[]) => {
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
        } else {
            appID = app;
        }

        uri = util.format(uri, appID);
        return this.makeRequest(uri).then((bts: IBusinessTransaction[]) => {
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
        } else {
            appID = app;
        }

        uri = util.format(uri, appID);
        return this.makeRequest(uri).then((tiers: ITier[]) => {
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
        } else {
            appID = app;
        }

        if (typeof tier === 'object') {
            tierID = tier.id;
        } else {
            tierID = tier;
        }

        uri = util.format(uri, appID, tierID);
        return this.makeRequest(uri).then((tiers: INode[]) => {
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
        } else {
            appID = app;
        }

        uri = util.format(uri, appID);
        return this.makeRequest(uri).then((backends: IBackend[]) => {
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
        } else {
            appID = app;
        }

        uri = util.format(uri, appID);
        return this.makeRequest(uri).then((nodes: INode[]) => {
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
        } else {
            appID = app;
        }

        if (typeof node === 'object') {
            nodeID = node.id;
        } else {
            nodeID = node;
        }

        uri = util.format(uri, appID, nodeID);
        return this.makeRequest(uri).then((nodes: INode[]) => {
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
        } else {
            appID = app;
        }

        if (typeof tier === 'object') {
            tierID = tier.id;
        } else {
            tierID = tier;
        }

        uri = util.format(uri, appID, tierID);
        return this.makeRequest(uri).then((nodes: INode[]) => {
            return nodes;

        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });
    }

    // Metrics API

    buildMetricHierarchy(path: string) {
        const arrayNodes = path.split('|');

    }

    getMetricHierarchy(app, metricPath?) {
        let uri = '/controller/restui/metric/application/%s/metricbrowser';
        let appID = null;

        if (typeof app === 'object') {
            appID = app.id;
        } else {
            appID = app;
        }

        if (metricPath == null) {
            metricPath = '';
        } else {
            metricPath += '|';
        }

        const cookieJar = request.jar(); // We need this to maintain session (JSESSIONID needed for next request)
        uri = util.format(uri, appID);


        return this.makeRequest('/api/ecl', {}, { jar: cookieJar }).then((res) => {
            return this.makeRequest(uri, { path: 'root', jar: cookieJar })
                .then((response) => {
                    return response;
                });
        });


    }

}

const controller = process.env.CONTROLLER_HOST;
const user = process.env.CONTROLLER_USER;
const pass = process.env.CONTROLLER_PASSWORD;
const tenant = process.env.CONTROLLER_TENANT;

const appD = new AppDynamicsApi(controller, user, pass, tenant);

appD.getBusinessApplications().then((apps) => {
    if (apps.length > 0) {
        appD.getMetricHierarchy(apps[0]).then((metricHierarchy) => {
            console.log('\nGOT THEM');
            console.log(metricHierarchy);
            console.log('END\n');
        });

    }
});


