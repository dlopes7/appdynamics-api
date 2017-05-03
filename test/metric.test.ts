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

describe('Get Metric Hierarchy', () => {

    it('Gets the full metric hierarchy', () => {
        const appD = new AppDynamicsApi(controller, user, pass, tenant);

        return appD.getBusinessApplications().then((apps) => {
            if (apps.length > 0) {
                return appD.getMetricHierarchy(apps[0]).then((metricHierarchy) => {
                    expect(metricHierarchy).to.be.an('array');
                });

            }
        });
    });
});
