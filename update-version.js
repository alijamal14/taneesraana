#!/usr/bin/env node

/**
 * Auto-Update Version Bumper
 * Run this script after making changes to automatically update version numbers
 * Usage: node update-version.js [patch|minor|major]
 */

const fs = require('fs');
const path = require('path');

function bumpVersion(currentVersion, type = 'patch') {
    const parts = currentVersion.split('.').map(Number);
    
    switch (type) {
        case 'major':
            parts[0]++;
            parts[1] = 0;
            parts[2] = 0;
            break;
        case 'minor':
            parts[1]++;
            parts[2] = 0;
            break;
        case 'patch':
        default:
            parts[2]++;
            break;
    }
    
    return parts.join('.');
}

function updateVersionInFile(filePath, oldVersion, newVersion) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        
        // Replace version strings
        content = content.replace(new RegExp(`\\?v=${oldVersion}`, 'g'), `?v=${newVersion}`);
        content = content.replace(new RegExp(`v${oldVersion}`, 'g'), `v${newVersion}`);
        content = content.replace(new RegExp(`"${oldVersion}"`, 'g'), `"${newVersion}"`);
        content = content.replace(new RegExp(`'${oldVersion}'`, 'g'), `'${newVersion}'`);
        
        fs.writeFileSync(filePath, content);
        console.log(`✓ Updated ${path.basename(filePath)}`);
    } catch (error) {
        console.error(`✗ Failed to update ${filePath}:`, error.message);
    }
}

function main() {
    const versionType = process.argv[2] || 'patch';
    const versionPath = './version.json';
    
    try {
        // Read current version
        const versionData = JSON.parse(fs.readFileSync(versionPath, 'utf8'));
        const oldVersion = versionData.version;
        const newVersion = bumpVersion(oldVersion, versionType);
        
        console.log(`Updating version from ${oldVersion} to ${newVersion}`);
        
        // Update version.json
        versionData.version = newVersion;
        versionData.timestamp = new Date().toISOString();
        versionData.files = {
            "styles.css": newVersion,
            "script.js": newVersion,
            "index.html": newVersion
        };
        
        fs.writeFileSync(versionPath, JSON.stringify(versionData, null, 2));
        console.log(`✓ Updated version.json`);
        
        // Update other files
        updateVersionInFile('./index.html', oldVersion, newVersion);
        updateVersionInFile('./script.js', oldVersion, newVersion);
        updateVersionInFile('./sw.js', oldVersion, newVersion);
        
        console.log(`\n🎉 Successfully updated to version ${newVersion}`);
        console.log('💡 Tip: Deploy your changes and clients will automatically detect the update!');
        
    } catch (error) {
        console.error('❌ Failed to update version:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

module.exports = { bumpVersion, updateVersionInFile };
