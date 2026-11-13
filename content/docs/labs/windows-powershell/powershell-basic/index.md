---
title: Basic PowerShell Administration Script
description: A basic PowerShell script using functions, loops, and a switch-case menu to automate common Active Directory tasks on Windows Server.
sidebar:
  label: AD Admin (Basic)
  order: 7
---

## Administration script

1. Execute the `directory_admin_basic.ps1` script to launch the interactive menu. Ensure you run the script in an elevated session.

```powershell
# directory_admin_basic.ps1
# Interactive administration script for AD DS Users, Groups, and Server Roles

function Create-User {
    param(
        [string]$Username,
        [string]$Password
    )
    # Convert password to secure string and create AD User
    $SecurePassword = ConvertTo-SecureString $Password -AsPlainText -Force
    New-ADUser -Name $Username -AccountPassword $SecurePassword -Enabled $true
    Write-Host "User '$Username' created successfully." -ForegroundColor Green
}

function Create-Group {
    param(
        [string]$GroupName
    )
    # Create a Global Security Group in Active Directory
    New-ADGroup -Name $GroupName -GroupScope Global -GroupCategory Security
    Write-Host "Group '$GroupName' created successfully." -ForegroundColor Green
}

function Add-ServerRole {
    param(
        [string]$Role
    )
    # Install the requested Windows Feature with Management Tools
    Install-WindowsFeature -Name $Role -IncludeManagementTools
    Write-Host "Server role '$Role' installed successfully." -ForegroundColor Green
}

# Main Menu Loop
do {
    Write-Host "`n==================================" -ForegroundColor Cyan
    Write-Host "    Select an Administrative Task"
    Write-Host "==================================" -ForegroundColor Cyan
    Write-Host "1. Create a User"
    Write-Host "2. Create a Group"
    Write-Host "3. Add Server Role"
    Write-Host "4. Exit"
    Write-Host "----------------------------------" -ForegroundColor Cyan
    
    $choice = Read-Host "Enter your choice (1-4)"
    
    switch ($choice) {
        1 {
            $Username = Read-Host "Enter the username"
            $Password = Read-Host "Enter the password"
            Create-User -Username $Username -Password $Password
        }
        2 {
            $GroupName = Read-Host "Enter the group name"
            Create-Group -GroupName $GroupName
        }
        3 {
            $Role = Read-Host "Enter the server role (e.g., AD-Domain-Services)"
            Add-ServerRole -Role $Role
        }
        4 {
            Write-Host "Exiting script..." -ForegroundColor Yellow
            break
        }
        default {
            Write-Host "Invalid choice, please try again." -ForegroundColor Red
        }
    }
} while ($choice -ne 4)
```

## Execution steps

1. Start an elevated PowerShell session on the Domain Controller. Verify the `ActiveDirectory` module is installed.
1. Run the script to display the console menu.
1. Enter `1` to create a user account. Provide the username and password prompts.
1. Enter `2` to create a security group. Provide the requested group name.
1. Enter `3` to install a Windows Server role. Specify the feature name, such as `AD-Domain-Services`.
1. Enter `4` to exit the administration script.
