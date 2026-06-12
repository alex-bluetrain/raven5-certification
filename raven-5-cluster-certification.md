# **Raven 5 Cluster Certification**

##

## **Revision 1.0**

# **INTRODUCTION**

This document specifies the test criteria to evaluate a Raven Cluster installation.

The purpose of these tests is to verify that all elements in the cluster are working properly and can adapt to failures as expected.

# **PREREQUISITES**

A Raven Cluster must be already deployed and configured in order to perform these tests.

#

# **CLUSTER VERIFICATION**

## **1 \- Single Point of Failure**

Perform a thorough evaluation of your cluster’s underlying infrastructure and architecture.

The goal is to evaluate which level of redundancy you require and detect any possible single points of failure in your architecture.

Be sure to consider hardware redundancy as well as geographic redundancy. You may want to document your findings.

## **2 \- License Key Validation**

Verify the license key is installed and correctly configured.

Open **Management Studio**, go to **About** and verify the **License Information** is correct, such as license type, expiration date and enabled features.

## **3 \- Public Server URL**

Confirm all nodes can be reached by the Public Server URL

Go to **Management Studio** \> **Manage Server** \> **Cluster**, and click on each node’s address

A new browser window should popup on each click, showing that node’s Management Studio

**Note:** If your cluster nodes are behind a firewall, be sure to perform this test from a host that is allowed to access that network.

##

## **4 \- Number of Voting Nodes**

Verify there is an odd number of at least 3 voting nodes on the cluster.

For ACID guarantees, a majority of the voting nodes must agree on every cluster-wide transaction, so having an odd number of nodes makes achieving the majority easier.

Open the **Management Studio**, go to **Manage Server**, then **Cluster** to see the cluster topology.

You should see an odd number of at least 3 voting nodes. You can tell if a node is a voting node by checking its type, only **Member** and **Leader** participate in voting.

If you have an even number of voting nodes, demote one node to **Watcher**, so it doesn’t participate in the voting scheme.

## **5 \- Identical Cluster Configuration among nodes**

Verify all nodes share the same **Cluster Configuration**

Cluster Configuration mismatches between nodes tend to cause interaction problems.

On each node: go to **Management Studio** \> **Manage Server** \> **Server Settings** then enter “cluster” in the “Filter keys” search box

All nodes should share the exact same “Effective Value” on each configuration.

## **6 \- Standard Reboot Test**

Confirm the cluster becomes online after rebooting all nodes.

Manually reboot all virtual machines or hosts where the nodes are running (not just the containers)

The cluster should become online after a while with all nodes active.

##

## **7 \- Promote and Demote Test**

Confirm the cluster nodes can be demoted and promoted.

Go to **Management Studio** \> **Manage Server** \> **Cluster** and click **Demote** on all Member nodes.

You should see the node type changing from **Member** to **Watcher**

Click **Promote** on all Watcher nodes

You should see the node type changing from **Watcher** to **Member**

## **8 \- Leader Reelection Test**

Confirm all nodes can be reelected as Leader

Open **Management Studio** \> **Manage Server** \> **Cluster** and click **Operations** on the Leader node, then click **Step Down**

Expected result: Another node should be elected as the Leader

repeat this procedure many times as needed to confirm all nodes can be elected as Leader.

## **9 \- Catastrophic Node Failure Test**

Confirm the cluster reacts to a catastrophic node failure.

Choose any random node and execute the linux command “sudo halt**”** on the virtual machine or host where it is running (not the container)

> [!WARNING]
> This command will instruct the hardware to stop all CPU functions, making it absolutely unresponsive until you manually reboot it.

open **Management Studio** \> **Manage Server** \> **Cluster** to confirm the cluster detects the node error.

Then reboot the halted node and confirm it can correctly rejoin the cluster.

##

## **10 \- Dynamic Database Distribution Test**

Verify the replication factor is maintained when a database node fails.

The replication factor is the amount of database replicas to maintain in the cluster.

Open **Management Studio** and create a new database with the following settings:![][image1]

You should see the database with two member nodes with an **M** icon like this:![][image2]

Shutdown one of those nodes.

After 60 seconds being offline, the node should change its state from **Member** to **Rehab** (the icon changes from **M** to **R)**

After 15 minutes of being in **Rehab** state, a new node should be automatically added to the database group as a replacement for the Rehab node.

After the new replica gets up-to-date, the Rehab node should be automatically marked for deletion: notice its icon changes from **R** to a trash can icon.

Startup the offline node and verify it gets deleted from that database group. (it only gets deleted after offloading all pending documents it may have)

Delete the database after the test is completed.

## **11 \- Single-Node Data Availability Test**

Confirm write operations are allowed on the database even when the majority of the cluster nodes are offline.

Create a database called “certification-tests” with a replication factor of 3

Run the following test:

```javascript
yarn run single-node-test
```

Note: This will start writing documents to the “certification-tests” database every 3 seconds

Stop all nodes except one.

Verify the test still runs without errors.

Start the stopped nodes

Verify the cluster is operative with all the nodes

Stop the script and delete the database.

## **12 \- Cluster-Wide Data Availability Test**

Confirm write operations are only allowed when the majority of the nodes have approved the transaction.

Create a database called “certification-tests” with a replication factor of 3

Run the following test:

```javascript
yarn run cluster-wide-test
```

Note: This will start writing documents to the “certification-tests” database every 3 seconds, and will fail if the majority of nodes cannot approve the transaction.

Verify the documents are being written to the database.

Shutdown one node at a time, until there is no majority of nodes.

the script should throw an error, as there are not enough nodes to approve the transaction.

delete the database when finished.

## **13 \- Write Assurance Test**

Confirm the write assurance work as expected

Sometimes you might need to ensure that changes made in the session will be replicated to more than one node.

Create a database called “certification-tests” with a replication factor of 3

Run the following test:

```javascript
yarn run write-assurance-test
```

Note: this will start writing documents to “certification-tests” database every 3 seconds, and should fail if the document can’t be written at least in 1 replica (with a 30 seconds timeout)

Verify the documents are being written in the database.

Shutdown all nodes except 2

Verify the documents are still being written.

Shutdown one more node

The script should pause for 30 seconds, and throw an error as it can’t comply with the write assurance.

Bring one node online and re-run **yarn run write-assurance-test**

Verify the documents are being written.

stop the script and delete the database

# **TEST RESULTS**

| Ok  | Fail | N/A | Test                                      |                                                   Notes                                                   |
| :-: | :--: | :-: | ----------------------------------------- | :-------------------------------------------------------------------------------------------------------: |
| ⬜  |  ⬜  | ⬜  | 1 \- Single Point of Failure              | <img src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==" width="300" height="0"> |
| ⬜  |  ⬜  | ⬜  | 2 \- License Key Validation               |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 3 \- Public Server URL                    |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 4 \- Number of Voting Nodes               |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 5 \- Identical Cluster Configuration      |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 6 \- Standard Reboot Test                 |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 7 \- Promote and Demote Test              |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 8 \- Leader Reelection Test               |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 9 \- Catastrophic Node Failure Test       |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 10 \- Dynamic Database Distribution Test  |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 11 \- Single-Node Data Availability Test  |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 12 \- Cluster-Wide Data Availability Test |                                                                                                           |
| ⬜  |  ⬜  | ⬜  | 13 \- Write Assurance Test                |                                                                                                           |

[image1]: data:image/png;base64,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
[image2]: data:image/png;base64,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

