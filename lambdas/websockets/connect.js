const Dynamo = require('../common/dynamoHelper');


const tableName = "ws_users";
exports.handler = async event => {

    console.log("connection event at line 8");
    console.log(event);
    console.log("connection event at line 9");
    console.log("connection event at line 10 req context");
    console.log(event.requestContext);
    const {connectionId, domainName, stage} = event.requestContext;

    const data = {

        id : connectionId,
        date : Date.now(),
        messages : [],
        domainName,
        stage
    }

    await Dynamo.write(data, tableName);

    return {
        statusCode: 200,
        body: JSON.stringify(
          {
            message: 'Hi from server, you are succssfully connected',

          },
          null,
          2
        ),
      };
}