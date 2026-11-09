---
title: DHCP Server Installation & Configuration
description: A step-by-step guide to installing the DHCP Server role on Windows Server, setting up IP scopes and exclusion ranges, and configuring dynamic IP leasing on a Windows 10 host client.
sidebar:
  label: DHCP Server Installation
  order: 3
---


## Lab objectives

Install the DHCP Server role on Windows Server. Configure a DHCP IP address scope and exclusion ranges. Verify dynamic IP leasing on a Windows 10 client.

![DHCP Lab Cover](images/Lab-1-Rajkumar-Neupane.pdf-0-1.png)

## Phase 1 DHCP server role installation

1. Open the **Add Roles and Features Wizard** from **Server Manager**.
2. Navigate to the **Server Roles** tab. Check the box for **DHCP Server**.

   ![Step 1 - DHCP Role Selection](images/Lab-1-Rajkumar-Neupane.pdf-1-1.png)

3. Review the selected options in the confirmation tab. Check **Restart the destination server automatically if required**.
4. Click **Install**.

   ![Step 2 - Confirm Installation Options](images/Lab-1-Rajkumar-Neupane.pdf-2-1.png)

5. Wait for the installation to finish.

   ![Step 3 - Installation Progress](images/Lab-1-Rajkumar-Neupane.pdf-3-1.png)

6. Click **Close** when the installation completes.
7. Click the warning flag in **Server Manager**. Select **Complete DHCP Configuration**.

   ![Step 4 - Complete Initial Configuration](images/Lab-1-Rajkumar-Neupane.pdf-4-1.png)

8. Authorize the DHCP server using Domain Administrator credentials in the Post-Install Wizard.
9. Review the security groups summary. Click **Close**.

   ![Step 5 - DHCP Authorization](images/Lab-1-Rajkumar-Neupane.pdf-5-1.png)

## Phase 2 DHCP scope configuration

1. Open the **DHCP console**.
1. Expand the IPv4 node. Right-click the node and select **New Scope**.
1. Provide a descriptive name for the scope.

    ![Step 6 - New Scope Wizard](images/Lab-1-Rajkumar-Neupane.pdf-5-2.png)

1. Enter the IP Address Range. Specify `192.168.10.20` to `192.168.10.100`. Specify subnet mask `255.255.255.0`.

    ![Step 7 - IP Address Range](images/Lab-1-Rajkumar-Neupane.pdf-6-1.png)

1. Specify any IP addresses within the pool to exclude. Enter the exclusion range and click **Add**.

    ![Step 8 - Add Exclusions](images/Lab-1-Rajkumar-Neupane.pdf-6-2.png)

1. Set the lease duration to 8 days.

    ![Step 9 - Lease Duration](images/Lab-1-Rajkumar-Neupane.pdf-7-1.png)

1. Select **Yes, I want to configure these options now** under **Configure DHCP Options**.
1. Enter the local gateway IP address on the Router page. Click **Add**.

    ![Step 10 - Router Option](images/Lab-1-Rajkumar-Neupane.pdf-8-1.png)

1. Enter the parent domain name. Provide the primary DNS server IP addresses.

    ![Step 11 - DNS Settings](images/Lab-1-Rajkumar-Neupane.pdf-9-1.png)
    ![Step 11 - DNS Add](images/Lab-1-Rajkumar-Neupane.pdf-10-1.png)

1. Select **Yes, I want to activate this scope now** on the final page.
1. Click **Finish**.

    ![Step 12 - Activate Scope](images/Lab-1-Rajkumar-Neupane.pdf-11-1.png)

## Phase 3 Client DHCP verification

1. Check the initial client network settings. Run `ipconfig /all`.

    ![Step 13 - Initial State](images/Lab-1-Rajkumar-Neupane.pdf-12-1.png)

1. Modify the Ethernet adapter properties on the Windows 10 host.
1. Select **Obtain an IP address automatically** and **Obtain DNS server address automatically**.
1. Click **OK**.

    ![Step 14 - Enable DHCP](images/Lab-1-Rajkumar-Neupane.pdf-13-1.png)

1. Open the Command Prompt on the client host.
1. Run `ipconfig /renew`. Verify the successful IP lease and network settings.

    ![Step 15 - Verification](images/Lab-1-Rajkumar-Neupane.pdf-14-1.png)
