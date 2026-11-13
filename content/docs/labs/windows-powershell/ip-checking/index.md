---
title: PowerShell IPv4 Address Validator
description: "A PowerShell script that checks whether a string is a valid IPv4 address: four numeric octets, each between 0 and 255."
sidebar:
  label: IPv4 Validator Script
  order: 8
---


## Validation script

1. Execute the `ip_validator.ps1` script to perform validation. The script splits the input and checks numeric bounds.

```powershell
# ip_validator.ps1
# Validate IPv4 addresses with formatting and range checks

Clear-Host
$invalidChars = '[a-zA-Z]'

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "   PowerShell IPv4 Address Validator"
Write-Host "==========================================" -ForegroundColor Cyan

# Prompt user for IP input
$IP = Read-Host "Enter the IP address"
$octets = $IP -split '\.'
$isValid = $true

# Check if the address has exactly 4 octets
if ($octets.Count -eq 4) {
    $i = 0
    Write-Host "IP has valid 4-octet format. Checking values..." -ForegroundColor Yellow
    Start-Sleep -Seconds 1
    
    do {
        $octet = $octets[$i]
        
        # Check for letters or invalid characters
        if ($octet -match $invalidChars) {
            Write-Host "Validation Error: Octet '$octet' is invalid (contains letters/characters)." -ForegroundColor Red
            $isValid = $false
        } 
        # Check numeric range bounds
        elseif ([int]$octet -ge 0 -and [int]$octet -le 255) {
            Write-Host "Octet [$i]: '$octet' is valid." -ForegroundColor Green
        } 
        # Handle out of bounds
        else {
            Write-Host "Validation Error: Octet '$octet' is out of range (must be 0-255)." -ForegroundColor Red
            $isValid = $false
        }
        $i++
    } while ($i -lt $octets.Length -and $isValid)
    
    # Final validation output
    if ($isValid) {
        Write-Host "`nResult: The entered IP address '$IP' is VALID." -ForegroundColor Green
    } else {
        Write-Host "`nResult: The entered IP address '$IP' is INVALID." -ForegroundColor Red
    }
} else {
    Write-Host "Validation Error: The input '$IP' does not match the 4-octet format (X.X.X.X)." -ForegroundColor Red
}
```

## Test cases

1. Input an address with letters in an octet. Observe the validation failure.

   ![Test Case 1 - Invalid Characters](images/image1.png)

1. Input a valid IPv4 address. Observe the successful validation.

   ![Test Case 2 - Valid IP](images/image2.png)

1. Input an address with an octet exceeding 255. Observe the out-of-range failure.

   ![Test Case 3 - Out of Range](images/image3.png)

1. Input an address with an incorrect number of octets. Observe the format error.

   ![Test Case 4 - Wrong Format](images/image4.png)
