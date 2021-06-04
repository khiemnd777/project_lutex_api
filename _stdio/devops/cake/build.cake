#addin nuget:?package=Cake.FileHelpers&version=4.0.1
#addin nuget:?package=Cake.Yarn&version=0.4.8
#addin nuget:?package=Cake.Npm&version=1.0.0
#addin nuget:?package=Cake.Json&version=6.0.1
#addin nuget:?package=Cake.Git&version=1.0.1
#addin nuget:?package=Newtonsoft.Json&version=11.0.2

var target = Argument("target", "Default");

var root = "./../../../";
var rootBuild = "./../";
var templatePath = "./templates/";
// PM2 config
var pm2Config = "pm2.config.js";
var pm2ConfigPath = $"{root}{pm2Config}";
var pm2ConfigTemplate = $"{templatePath}{pm2Config}.template";
var pm2ConfigTemplatePath = $"{rootBuild}{pm2ConfigTemplate}";
// Server.js
var serverRun = "server.js";
var serverRunPath = $"{root}{serverRun}";
var serverRunTemplate = $"{templatePath}{serverRun}.template";
var serverRunTemplatePath = $"{rootBuild}{serverRunTemplate}";
// .env
var env = ".env";
var envPath = $"{root}{env}";
var envTemplate = $"{templatePath}{env}.template";
var envTemplatePath = $"{rootBuild}{envTemplate}";
// Configuration
var config = ParseJsonFromFile($"{root}build.config.json");
var mode = config["CONFIGURATION"].ToString();
var envMode = config["ENVIRONMENT"].ToString();
// Bind token to text.
private Cake.Common.Text.TextTransformation<Cake.Core.Text.TextTransformationTemplate> BindToken(string text, Newtonsoft.Json.Linq.JObject config) 
{
  var textTransform = TransformText (text, "{{", "}}");
  foreach(var token in config)
  {
    switch(token.Value.Type)
    {
      case Newtonsoft.Json.Linq.JTokenType.Boolean:
      {
        textTransform.WithToken(token.Key, token.Value.ToObject<string>().ToLower());  
      }
      break;
      default:
      {
        textTransform.WithToken(token.Key, token.Value);
      }
      break;
    }
  }
  return textTransform;
}

Task ("Clean")
  .Does (() =>
  {
    // Delete pm2 configuration file.
    if (FileExists (pm2ConfigPath))
    {
      Console.WriteLine ("Delete pm2 configuration file.");
      DeleteFile (pm2ConfigPath);
    }
    // Delete server.js
    if (FileExists (serverRunPath))
    {
      Console.WriteLine ("Delete server run file.");
      DeleteFile (serverRunPath);
    }
    // Delete .env
    if(FileExists(envPath))
    {
      Console.WriteLine ("Delete .env file.");
      DeleteFile(envPath);
    }
  });

Task ("Copy-FS")
  .Does (() =>
  {
    // Copy server.js
    if (FileExists (serverRunTemplatePath))
    {
      Console.WriteLine ("Copy run-server file.");
      CopyFile (serverRunTemplatePath, serverRunPath);
    }
    // Copy pm2 configuration file.
    if (FileExists (pm2ConfigTemplatePath))
    {
      Console.WriteLine ("Copy pm2 configuration file.");
      var pm2TemplateRead = FileReadText (pm2ConfigTemplatePath);
      // Replace tokens
      BindToken (pm2TemplateRead, config)
        .Save(pm2ConfigPath);
    }
    // Copy .env file.
    if(FileExists(envTemplatePath))
    {
      Console.WriteLine ("Copy .env file.");
      var envTemplateRead = FileReadText (envTemplatePath);
      // Replace tokens
      BindToken (envTemplateRead, config)
        .Save(envPath);
    }
  });

// Git
var gitBranch = config["GIT_BRANCH"]?.ToString();
var gitMergerName = config["GIT_MERGER_NAME"]?.ToString();
var gitMergerEmail = config["GIT_MERGER_EMAIL"]?.ToString();
var gitPassword = config["GIT_PASSWORD"]?.ToString();
var gitRemote = config["GIT_REMOTE"]?.ToString();

Task ("Git-Checkout")
  .Does(() => {
    StartProcess("git", new ProcessSettings{ Arguments = $"checkout -b {gitBranch} {gitRemote}/{gitBranch}" });
  });

Task ("Git-Pull")
  .Does(() => {
    var result = GitPull(root, gitMergerName, gitMergerEmail, gitMergerEmail, gitPassword, gitRemote);
  });

// Build
Task ("Build")
  .Does (() =>
  {
    // Yarn install & build
    Yarn.RunScript (mode == "debug" ? "build" : IsRunningOnWindows() ? "build:prod:win" : "build:prod");
  });

// Run
Task ("Run")
  .Does (() =>
  {
    // Yarn install & build
    if(envMode == "development"){
      Yarn.RunScript (mode == "debug" ? "develop" : IsRunningOnWindows() ? "develop:prod:win" : "develop:prod");
    } else {
      Yarn.RunScript (mode == "debug" ? "start" : IsRunningOnWindows() ? "start:prod:win" : "start:prod");
    }
  });

Task("Yarn-Install")
  .Does(() => {
    Yarn.Install();
  });

Task("PM2-Init")
  .Does(() => {
    Yarn.Add(settings => settings.Package("pm2").Globally());
  });

Task ("PM2-Delete")
  .Does(() => {
    Yarn.RunScript("delete:pm2");
  });

Task ("PM2-Stop")
  .Does(() => {
    Yarn.RunScript("stop:pm2");
  });

Task ("PM2-Start")
  .Does(() => {
    Yarn.RunScript (mode == "debug" ? "start:pm2" : "start:pm2:prod");
  });

// Rollback
var rollbackTask = Task("Rollback");
if(envMode == "development") {
  rollbackTask
    .IsDependentOn("Clean")
    .Does(() => {

    });
} else {
  Task("Rollback")
  .IsDependentOn("PM2-Init")
  .IsDependentOn("PM2-Stop")
  .IsDependentOn("PM2-Delete")
  .IsDependentOn("Clean")
  .Does(() => {

  });
}

// Default task
var defaultTask = Task ("Default");
if (envMode == "development") {
  defaultTask
    .IsDependentOn ("Clean")
    .IsDependentOn ("Copy-FS")
    .IsDependentOn ("Yarn-Install")
    .IsDependentOn ("Git-Checkout")
    .IsDependentOn ("Git-Pull")
    .IsDependentOn ("Build")
    .IsDependentOn ("Run")
    .Does (() =>
    {
      Information("Built with {0} environment.", envMode);
    });
} else {
  defaultTask
    .IsDependentOn ("Clean")
    .IsDependentOn ("Copy-FS")
    .IsDependentOn ("Yarn-Install")
    .IsDependentOn ("PM2-Init")
    .IsDependentOn ("PM2-Stop")
    .IsDependentOn ("Git-Checkout")
    .IsDependentOn ("Git-Pull")
    .IsDependentOn ("Build")
    .IsDependentOn ("PM2-Start")
    .Does (() =>
    {
      Information("Built with {0} environment.", envMode);
    });
}
defaultTask
  .OnError(exception =>
  {
    RunTarget("Rollback");
  });

RunTarget (target);
