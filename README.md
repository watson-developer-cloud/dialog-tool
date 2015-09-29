# Dialog Tool

  The Dialog Tool enables you to create, manage, and interact with dialogs for the IBM Watson [Dialog service][service_url].

Give it a try! Click the button below to fork into IBM DevOps Services and deploy your own copy of this application on Bluemix.

[![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://github.com/watson-developer-cloud/dialog-tool)

## Getting started


  1. Create a Bluemix account. [Sign up][sign_up] in Bluemix or use an existing account. Watson services in beta are free to use.

  2. Download and install the [Cloud-foundry CLI][cloud_foundry] tool.

  3. Edit the `manifest.yml` file and replace `<application-name>` with a unique name for your copy of the tool. The name that you specify determines the tool's URL, such as `<application-name>.mybluemix.net`. Do not use blank spaces in the name.
    
    ```none
    applications:
    - services:
      - dialog-service-beta
      name: <application-name>
      command: node app.js
      path: .
      memory: 128M
    ```
    
  4. Connect to Bluemix by running the following commands in the command-line tool:

    ```sh
    $ cf api https://api.ng.bluemix.net
    $ cf login -u <your-Bluemix-ID>
    ```

  5. Create the Dialog service in Bluemix by running the following command:

    ```sh
    $ cf create-service dialog beta dialog-service-beta
    ```

  6. Push it live by running the following command:

    ```sh
    $ cf push
    ```


## Running the tool locally
  The tool uses [Node.js](http://nodejs.org/) and [npm](https://www.npmjs.com/), so you must download and install them as part of the following steps.

  1. Copy the `username`, `password`, and `url` credentials from your `dialog-service` service in Bluemix to `app.js`. To see the credentials, run the following command, where `<application-name>` is the unique name you specified:
    
    ```sh
    $ cf env <application-name>
    ```
   The following example shows credentials for the Dialog service:

    ```sh
    System-Provided:
    {
    "VCAP_SERVICES": {
      "dialog": [{
          "credentials": {
            "url": "<url>",
            "password": "<password>",
            "username": "<username>"
          },
        "label": "dialog",
        "name": "dialog-service-beta",
        "plan": "beta"
     }]
    }
    }
    ```
  2. Install [Node.js](http://nodejs.org/).
  3. Go to the project folder in a terminal and run the `npm install` command.
  4. Start the application by running `node app.js`.
  5. Open `http://localhost:3000` to see the running application.

## Troubleshooting

To troubleshoot your Bluemix app the main useful source of information are the logs, to see them, run:

  ```sh
  $ cf logs <application-name> --recent
  ```

## License

  This sample code is licensed under Apache 2.0. Full license text is available in [LICENSE](LICENSE).  
  The library jQuery included in this sample uses a MIT license.

## Contributing

  See [CONTRIBUTING](CONTRIBUTING.md).

## Open Source @ IBM
  Find more open source projects on the [IBM Github Page](http://ibm.github.io/)

[cloud_foundry]: https://github.com/cloudfoundry/cli

[sign_up]: https://apps.admin.ibmcloud.com/manage/trial/bluemix.html?cm_mmc=WatsonDeveloperCloud-_-LandingSiteGetStarted-_-x-_-CreateAnAccountOnBluemixCLI
[service_url]: http://www.ibm.com/smarterplanet/us/en/ibmwatson/developercloud/doc/dialog/
