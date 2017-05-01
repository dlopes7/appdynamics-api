import * as rp from 'request-promise';
import * as util from 'util';

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

export class AppDynamicsApi {


    private controllerUrl: string;
    private user: string;
    private password: string;

    constructor(controller: string, user: string, password: string, tenant?: string) {
        this.controllerUrl = 'http://' + controller;

        this.user = user + '@' + (tenant || 'customer1');
        this.password = password;

    }

    makeRequest(uri, method = 'GET') {

        const options = {
            method,
            url: this.controllerUrl + uri,
            qs: {
                output: 'json'
            },
            json: true,
            auth: {
                user: this.user,
                password: this.password
            }
        };

        return rp(options)
            .then((res) => {
                return res;
            })
            .catch((err) => {
                console.log(`ERROR! ${err}`);
            });
    }

    getBusinessApplications() {

        const uri = '/controller/rest/applications';
        return this.makeRequest(uri)
            .then((apps: IApplication[]) => {
                console.log(`Found apps: ${apps}`);
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
            console.log(`Found BTs: ${bts}`);
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
            console.log(`Found Tiers: ${tiers}`);
            return tiers;


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
            console.log(`Found Backends: ${backends}`);
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
            console.log(`Found Nodes: ${nodes}`);
            return nodes;


        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });
    }

}



