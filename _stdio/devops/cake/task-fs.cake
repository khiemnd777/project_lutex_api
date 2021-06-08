#load "utilities.cake"
#load "constants.cake"
#load "task-fs.cake"

// Clean
Task ("Clean")
  .Does (() =>
  {
    var config = TaskConfiguration.GetConfig(Context);
    var pm2Path = new FilePath("pm2.config.js");
    var envPath = new FilePath(".env");
    var serverPath = new FilePath("server.js");
    Information ("Delete pm2 configuration file.");
    if (FileExists (pm2Path.Path))
    {
      DeleteFile (pm2Path.Path);
    }
    Information ("Delete server file.");
    if (FileExists (serverPath.Path))
    {
      DeleteFile (serverPath.Path);
    }
    Information ("Delete .env file.");
    if(FileExists(envPath.Path))
    {
      DeleteFile(envPath.Path);
    }
  });

// Copy File System.
Task ("Copy-FS")
  .Does (() =>
  {
    var config = TaskConfiguration.ToToken(Context);
    var pm2Path = new FilePath("pm2.config.js");
    var envPath = new FilePath(".env");
    var serverPath = new FilePath("server.js");

    Information("Copy pm2 configuration file.");
    Utility.SaveFileWithTokens(Context, pm2Path.TemplatePath, pm2Path.Path, config);
    Information("Copy server file.");
    Utility.SaveFileWithTokens(Context, serverPath.TemplatePath, serverPath.Path, config);
    Information("Copy .env file.");
    Utility.SaveFileWithTokens(Context, envPath.TemplatePath, envPath.Path, config);
  });