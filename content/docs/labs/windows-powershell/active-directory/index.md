---
title: Active Directory Services & User Creation
description: "Install AD DS on Windows Server, promote the server to a domain controller, and add users in a custom OU."
sidebar:
  label: Active Directory & Users
  order: 2
---


![Lab Overview Banner](images/ad-lab-page00-1.png)

## Phase 1 Active Directory installation

1. Open the **Server Manager** dashboard. Click **Manage** and select **Add Roles and Features**.

   ![Step 1 - Launch Wizard](images/ad-lab-page01-1.png)

2. Select **Role-based or feature-based installation**. Click **Next**.

   ![Step 2 - Installation Type](images/ad-lab-page02-1.png)

3. Select the target server from the server pool.

   ![Step 3 - Server Selection](images/ad-lab-page03-1.png)

4. Check the box for **Active Directory Domain Services**.

   ![Step 4 - Role Selection](images/ad-lab-page04-1.png)

5. Click **Add Features** to include required dependencies.

   ![Step 5 - Feature Confirmation](images/ad-lab-page05-1.png)

6. Verify the default features. Click **Next**.

   ![Step 6 - Features Review](images/ad-lab-page06-1.png)

7. Review the AD DS information screen. Click **Next**.

   ![Step 7 - AD DS Info](images/ad-lab-page07-1.png)

8. Verify the selected roles and features. Check **Restart the destination server automatically if required**. Click **Install**.

   ![Step 8 - Confirm Selections](images/ad-lab-page08-1.png)

9. Wait for the installation to finish.

   ![Step 9 - Installation Progress](images/ad-lab-page09-1.png)

10. Click **Close** after successful installation.

    ![Step 10 - Installation Complete](images/ad-lab-page10-1.png)

## Phase 2 Domain controller promotion

1. Click the notification flag in **Server Manager**. Select **Promote this server to a domain controller**.
1. Select **Add a new forest**. Enter the root domain name.

    ![Step 11 - Deployment Config](images/ad-lab-page11-1.png)

1. Verify the functional levels. Check **Domain Name System (DNS) server** and **Global Catalog (GC)**. Specify a DSRM password.

    ![Step 12 - DC Options](images/ad-lab-page12-1.png)

1. Review the DNS delegation warning. Click **Next**.

    ![Step 13 - DNS Options](images/ad-lab-page13-1.png)

1. Verify the automatically generated NetBIOS domain name. Click **Next**.

    ![Step 14 - NetBIOS Name](images/ad-lab-page14-1.png)

1. Confirm the default file storage locations. Click **Next**.

    ![Step 15 - Folder Paths](images/ad-lab-page15-1.png)

1. Review the configuration summary. Click **Next**.

    ![Step 16 - Review Selection](images/ad-lab-page16-1.png)

1. Pass the prerequisite checks. Click **Install**.

    ![Step 17 - Prerequisite Check](images/ad-lab-page17-1.png)

1. Wait for the server to restart automatically.

    ![Step 18 - Installation](images/ad-lab-page18-1.png)

1. Log in using the domain administrator credentials.

    ![Step 19 - Domain Sign-In](images/ad-lab-page19-1.png)

1. Verify the **AD DS** and **DNS** services are running in **Server Manager**.

    ![Step 20 - Service Verification](images/ad-lab-page20-1.png)

## Phase 3 User provisioning

1. Open the **Active Directory Users and Computers** console.
1. Right-click the root domain. Select **New** and click **Organizational Unit**.
1. Name the new OU and click **OK**.

    ![Step 21 - OU Creation](images/ad-lab-page21-1.png)

1. Right-click inside the new OU. Select **New** and click **User**.
1. Enter the user details. Define a secure password.
1. Configure the logon policies. Click **Finish**.

    ![Step 22 - User Accounts Created](images/ad-lab-page22-1.png)
