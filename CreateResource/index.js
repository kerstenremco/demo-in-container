const { ContainerInstanceManagementClient } = require("@azure/arm-containerinstance");
const { DefaultAzureCredential } = require("@azure/identity");

const resources = require("./resources.json");

const subscriptionId = process.env.subscription;
const cr = new DefaultAzureCredential();
const client = new ContainerInstanceManagementClient(new DefaultAzureCredential(), subscriptionId);

async function createContainer(name, containerOptios) {
  containerOptios.containers[0].name = name;
  const result = await client.containerGroups.beginCreateOrUpdate(process.env.resourceGroup, name, containerOptios);
  return result;
  //   for await (const test of client.containerGroups.list()) {
  //     console.log(test.containers.resources);
  //   }
}

const handler = async function (context, req) {
  //   context.log("JavaScript HTTP trigger function processed a request.");

  const resource = req.query.resource;
  if (!resource) return (context.res = { body: "Geen resource opgegeven" });

  const resourceOptions = resources[resource];
  if (!resourceOptions) return (context.res = { body: "Resource not found" });

  const result = await createContainer("coco-baam", resourceOptions.containerOptios);

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: result,
  };
};

module.exports = handler;
