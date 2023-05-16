const { ContainerInstanceManagementClient } = require("@azure/arm-containerinstance");
const { DefaultAzureCredential } = require("@azure/identity");

const subscriptionId = process.env.subscription;
const client = new ContainerInstanceManagementClient(new DefaultAzureCredential(), subscriptionId);

module.exports = async function (context, myTimer) {
  for await (const test of client.containerGroups.list) {
    console.log(test);
  }
  context.log("JavaScript timer trigger function ran!", timeStamp);
};
