import * as dotenv from 'dotenv';
dotenv.config();

import * as mocha from 'mocha';
import * as chai from 'chai';

import { AppDynamicsApi } from '../src/appd_api';

const expect = chai.expect;

const controller = process.env.CONTROLLER_HOST;
const user = process.env.CONTROLLER_USER;
const pass = process.env.CONTROLLER_PASSWORD;
const tenant = process.env.CONTROLLER_TENANT;

describe('Get Business Applications', () => {

    it('Returns an array empty or with ID and Name', () => {
        const appD = new AppDynamicsApi(controller, user, pass, tenant);
        console.log(user);

        return appD.getBusinessApplications().then((apps) => {
            expect(apps).to.be.an('array');
            if (apps.length > 0) {
                expect(apps[0]).to.have.property('id');
                expect(apps[0]).to.have.property('name');
            }
        });
    });
});

describe('Get Business Transactions', () => {

    it('Returns an array empty or with ID, Name, InternalName', () => {
        const appD = new AppDynamicsApi(controller, user, pass, tenant);

        return appD.getBusinessApplications().then((apps) => {

            // Should work with an object
            return appD.getBusinessTransactions(apps[0]).then((bts) => {
                if (bts.length > 0) {
                    expect(bts[0]).to.have.property('id');
                    expect(bts[0]).to.have.property('name');
                    expect(bts[0]).to.have.property('internalName');
                }
            });

        });
    });
});

describe('Get Tiers', () => {

    it('Returns an array empty or with ID, Name, Type', () => {
        const appD = new AppDynamicsApi(controller, user, pass, tenant);

        return appD.getBusinessApplications().then((apps) => {

            // Should work with an object
            return appD.getTiers(apps[0]).then((tiers) => {
                if (tiers.length > 0) {
                    expect(tiers[0]).to.have.property('id');
                    expect(tiers[0]).to.have.property('name');
                    expect(tiers[0]).to.have.property('type');
                }
            });

        });
    });
});

describe('Get Backends', () => {

    it('Returns an array empty or with ID, Name, Properties', () => {
        const appD = new AppDynamicsApi(controller, user, pass, tenant);

        return appD.getBusinessApplications().then((apps) => {

            // Should work with an object
            return appD.getBackends(apps[0]).then((backends) => {
                if (backends.length > 0) {
                    expect(backends[0]).to.have.property('id');
                    expect(backends[0]).to.have.property('name');
                    expect(backends[0]).to.have.property('properties');
                }
            });

        });
    });
});

describe('Get Nodes', () => {

    it('Returns an array empty or with ID, Name, nodeUniqueLocalId', () => {
        const appD = new AppDynamicsApi(controller, user, pass, tenant);

        return appD.getBusinessApplications().then((apps) => {

            // Should work with an object
            return appD.getNodes(apps[0]).then((nodes) => {
                if (nodes.length > 0) {
                    expect(nodes[0]).to.have.property('id');
                    expect(nodes[0]).to.have.property('name');
                    expect(nodes[0]).to.have.property('nodeUniqueLocalId');
                }
            });

        });
    });
});

describe('Get single Node', () => {

    it('Returns a Node object with ID, Name, nodeUniqueLocalId', () => {
        const appD = new AppDynamicsApi(controller, user, pass, tenant);

        return appD.getBusinessApplications().then((apps) => {
            return appD.getNodes(apps[0]).then((nodes) => {
                return appD.getNode(apps[0], nodes[0]).then((node) => {
                    expect(node).to.have.property('id');
                    expect(node).to.have.property('name');
                    expect(node).to.have.property('nodeUniqueLocalId');
                });
            });
        });
    });
});

describe('Get Nodes in Tier', () => {

    it('Returns a list of Nodes in a Tier with ID, Name, nodeUniqueLocalId, or an empty list', () => {
        const appD = new AppDynamicsApi(controller, user, pass, tenant);

        return appD.getBusinessApplications().then((apps) => {
            return appD.getTiers(apps[0]).then((tiers) => {
                return appD.getNodesInTier(apps[0], tiers[0]).then((nodes) => {
                    if (nodes.length > 0) {
                        expect(nodes[0]).to.have.property('id');
                        expect(nodes[0]).to.have.property('name');
                        expect(nodes[0]).to.have.property('nodeUniqueLocalId');
                    }
                });
            });
        });
    });
});

describe('Get single Tier', () => {

    it('Returns a Tier object with ID, Name, Type', () => {
        const appD = new AppDynamicsApi(controller, user, pass, tenant);

        return appD.getBusinessApplications().then((apps) => {
            return appD.getTiers(apps[0]).then((tiers) => {
                return appD.getTier(apps[0], tiers[0]).then((tier) => {
                    expect(tier).to.have.property('id');
                    expect(tier).to.have.property('name');
                    expect(tier).to.have.property('type');
                });
            });
        });
    });
});
