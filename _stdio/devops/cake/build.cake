#addin nuget:?package=Cake.FileHelpers&version=4.0.1
#addin nuget:?package=Cake.Yarn&version=0.4.8
#addin nuget:?package=Cake.Npm&version=1.0.0
#addin nuget:?package=Cake.Json&version=6.0.1
#addin nuget:?package=Cake.Git&version=1.0.1
#addin nuget:?package=Newtonsoft.Json&version=11.0.2

var target = Argument("target", "Default");

var root = "./../../../";
var rootBuild = "./../";
// PM2 config
var pm2Config = "pm2.config.js";
var pm2ConfigPath = $"{root}{pm2Config}";
var pm2ConfigTemplate = $"{pm2Config}.template";
var pm2ConfigTemplatePath = $"{rootBuild}{pm2ConfigTemplate}";
// Server.js
var serverRun = "server.js";
var serverRunPath = $"{root}{serverRun}";
var serverRunTemplate = $"{serverRun}.template";
var serverRunTemplatePath = $"{rootBuild}{serverRunTemplate}";
// .env
var env = ".env";
var envPath = $"{root}{env}";
var envTemplate = $"{env}.template";
var envTemplatePath = $"{rootBuild}{envTemplate}";
// Configuration
var config = ParseJsonFromFile("./build.config.json");
var mode = config["CONFIGURATION"].ToString();
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
var gitUserName = config["GIT_USERNAME"]?.ToString();
var gitPassword = config["GIT_PASSWORD"]?.ToString();
var gitRemote = config["GIT_REMOTE"]?.ToString();

Task ("Git-Checkout")
  .Does(() => {
    GitCheckout(root, gitBranch, new FilePath[0]);
  });

Task ("Git-Pull")
  .Does(() => {
    var result = GitPull(root, gitMergerName, gitMergerEmail, gitUserName, gitPassword, gitRemote);
  });

Task ("Build")
  .Does (() =>
  {
    // Yarn install & build
    Yarn.RunScript (mode == "debug" ? "build" : IsRunningOnWindows() ? "build:prod:win" : "build:prod");
  });

Task("PM2-Init")
  .Does(() => {
    Yarn.Add(settings => settings.Package("pm2").Globally()).Install();
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

Task("Rollback")
  .IsDependentOn("PM2-Init")
  .IsDependentOn("PM2-Stop")
  .IsDependentOn("PM2-Delete")
  .IsDependentOn("Clean")
  .Does(() => {

  });

Task ("Default")
  .IsDependentOn ("Clean")
  .IsDependentOn ("Copy-FS")
  .IsDependentOn ("PM2-Init")
  .IsDependentOn ("PM2-Stop")
  .IsDependentOn ("Git-Checkout")
  .IsDependentOn ("Git-Pull")
  .IsDependentOn ("Build")
  .IsDependentOn ("PM2-Start")
  .Does (() =>
  {

  })
  .OnError(exception =>
  {
    RunTarget("Rollback");
  });

RunTarget (target);
