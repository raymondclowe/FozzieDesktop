# Release Process

This document describes how to create releases for FozzieDesktop.

## Automated Release Process

The project includes a GitHub Actions workflow that automatically builds and publishes releases for Windows and Linux platforms.

### Creating a Release

1. **Tag-based Release (Recommended)**:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```
   This will automatically trigger the release workflow.

2. **Manual Release**:
   - Go to the GitHub Actions tab
   - Find the "Release" workflow
   - Click "Run workflow"
   - Enter the version number (e.g., v1.0.0)
   - Click "Run workflow"

### What Gets Built

The release workflow creates the following artifacts:

**Windows:**
- `.exe` installer (NSIS)
- `.zip` portable version

**Linux:**
- `.AppImage` universal package
- `.tar.gz` archive

### Release Assets

All builds are automatically uploaded to the GitHub release with descriptive names:
- `FozzieDesktop-v1.0.0-setup.exe` (Windows installer)
- `FozzieDesktop-v1.0.0-windows.zip` (Windows portable)
- `FozzieDesktop-v1.0.0-linux.AppImage` (Linux universal)
- `FozzieDesktop-v1.0.0-linux.tar.gz` (Linux archive)

## Local Development Builds

For testing purposes, you can build locally:

```bash
# Build for current platform
npm run dist

# Build for specific platforms
npm run dist:linux
npm run dist:win

# Build application only (no packaging)
npm run build
npm run electron
```

## Version Management

Update the version in `package.json` before creating a release:

```json
{
  "version": "1.0.0"
}
```

The electron-builder will automatically use this version for the generated packages.

## Requirements

- Node.js 20+
- npm 10+
- For Windows builds: Windows or CI environment
- For Linux builds: Linux or CI environment

## Troubleshooting

**Local build fails with GitHub token error:**
This is expected for local builds. The error occurs because electron-builder tries to auto-publish, but the actual build artifacts are still created successfully in the `release/` directory.

**AppImage doesn't run on Linux:**
Make sure the AppImage has execute permissions:
```bash
chmod +x FozzieDesktop-*.AppImage
```

**Windows antivirus flags the executable:**
This is common for unsigned executables. The application is safe, but users may need to add an exception or use the portable zip version.