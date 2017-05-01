import * as dotenv from 'dotenv';
dotenv.config();

import * as mocha from 'mocha';
import * as chai from 'chai';

import { AppDynamicsApi } from '../src/appd_api';

const expect = chai.expect;

const controller = process.env.CONTROLLER_HOST;
const user = process.env.CONTROLLER_USER;
const pass = process.env.CONTROLLER_PASSWORD;

describe('Get Business Applications', () => {

    it('Returns an array empty or with ID and Name', () => {
        const appD = new AppDynamicsApi(controller, user, pass);
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
        const appD = new AppDynamicsApi(controller, user, pass);

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
        const appD = new AppDynamicsApi(controller, user, pass);

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
        const appD = new AppDynamicsApi(controller, user, pass);

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

    it('Returns an array empty or with ID, Name, Properties', () => {
        const appD = new AppDynamicsApi(controller, user, pass);

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
