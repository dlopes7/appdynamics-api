import * as rp from 'request-promise';
import * as util from 'util';

interface IApplication {
    id: string;
    name: string;
    description: string;
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
        return this.makeRequest(uri).then((bts: object[]) => {
            console.log(`Found BTs: ${bts}`);
            return bts;


        }).catch((err) => {
            console.log(`ERROR: ${err}`);
        });

    }

}



