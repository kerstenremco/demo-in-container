const { ContainerInstanceManagementClient } = require("@azure/arm-containerinstance");
const { DefaultAzureCredential } = require("@azure/identity");

const subscriptionId = process.env.subscription;
const client = new ContainerInstanceManagementClient(new DefaultAzureCredential(), subscriptionId);

async function checkContainer(name) {
  try {
    const result = await client.containerGroups.get(process.env.resourceGroup, name);
    return result;
  } catch (e) {
    return false;
  }
}

const handler = async function (context, req) {
  //   context.log("JavaScript HTTP trigger function processed a request.");

  const container = req.query.container;
  if (!container) return (context.res = { body: "Geen resource opgegeven" });

  const result = await checkContainer(container);

  const body = { state: "Not found" };
  if (result) {
    body.ttl = result.containers[0].instanceView.currentState.startTime;
    body.state = result.containers[0].instanceView.currentState.state;
  }

  context.res = {
    // status: 200, /* Defaults to 200 */
    body,
  };
};

module.exports = handler;
